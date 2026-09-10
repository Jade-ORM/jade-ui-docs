import { Router } from "express";
import {
  assertCanPublish,
  fetchJadePluginJson,
  parseGitHubRepoUrl,
  pluginIdFromRepo,
  validateManifest,
} from "../lib/github.js";
import { getSessionUser } from "../lib/session.js";
import {
  deleteCommunityPlugin,
  getCommunityPlugin,
  listCommunityPlugins,
  rateLimit,
  upsertCommunityPlugin,
} from "../lib/store.js";
import { clientIp } from "../lib/http.js";
import type { CommunityPlugin, SessionUser } from "../lib/types.js";

export const pluginsRouter = Router();

pluginsRouter.get("/", async (req, res) => {
  const rl = await rateLimit(`list:${clientIp(req)}`, 60, 60);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfterSec));
    res
      .status(429)
      .json({
        error: {
          code: "J4290",
          message: "Too many requests. Try again shortly.",
        },
      });
    return;
  }
  const plugins = await listCommunityPlugins();
  res.json({ plugins });
});

pluginsRouter.post("/", async (req, res) => {
  const session = getSessionUser(req);
  if (!session) {
    res.status(401).json({
      error: {
        code: "J4010",
        message: "Sign in with GitHub to submit a plugin.",
      },
    });
    return;
  }

  const rl = await rateLimit(`submit:${session.githubId}`, 5, 3600);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfterSec));
    res.status(429).json({
      error: {
        code: "J4291",
        message: "Submission rate limit reached (5 per hour). Try again later.",
      },
    });
    return;
  }

  const repoUrl =
    typeof req.body?.repository === "string" ? req.body.repository.trim() : "";
  if (!repoUrl) {
    res
      .status(400)
      .json({
        error: { code: "J4002", message: "repository URL is required." },
      });
    return;
  }

  const parsed = parseGitHubRepoUrl(repoUrl);
  if (!parsed) {
    res.status(400).json({
      error: {
        code: "J4003",
        message: "Only github.com repository URLs are accepted.",
      },
    });
    return;
  }

  const access = await assertCanPublish(session, parsed.owner, parsed.repo);
  if (!access.ok) {
    res.status(403).json({ error: { code: "J4030", message: access.message } });
    return;
  }

  const fetched = await fetchJadePluginJson(
    parsed.owner,
    parsed.repo,
    session.accessToken,
  );
  if (!fetched.ok) {
    res
      .status(422)
      .json({ error: { code: "J4220", message: fetched.message } });
    return;
  }

  const validationErrors = validateManifest(fetched.manifest);
  if (validationErrors.length > 0) {
    res.status(422).json({
      error: {
        code: "J4221",
        message: `Invalid jade-plugin.json: ${validationErrors.join("; ")}`,
      },
    });
    return;
  }

  const id = pluginIdFromRepo(parsed.owner, parsed.repo);
  const now = new Date().toISOString();
  const existing = (await listCommunityPlugins()).find((p) => p.id === id);
  if (existing && existing.owner.githubId !== session.githubId) {
    res.status(403).json({
      error: {
        code: "J4031",
        message: "This repository is already listed by another author.",
      },
    });
    return;
  }

  const plugin: CommunityPlugin = {
    id,
    name: fetched.manifest.name.trim(),
    version: fetched.manifest.version.trim(),
    description: fetched.manifest.description.trim(),
    jade: fetched.manifest.jade.trim(),
    lua: fetched.manifest.lua?.trim() || undefined,
    main: fetched.manifest.main.trim(),
    repository: `https://github.com/${parsed.owner}/${parsed.repo}`,
    keywords: Array.isArray(fetched.manifest.keywords)
      ? fetched.manifest.keywords.slice(0, 12).map((k) => String(k))
      : [],
    owner: {
      githubId: session.githubId,
      login: session.login,
      avatarUrl: session.avatarUrl,
    },
    submittedAt: existing?.submittedAt || now,
    updatedAt: now,
  };

  await upsertCommunityPlugin(plugin);
  res.status(existing ? 200 : 201).json({ plugin });
});

pluginsRouter.get("/:owner/:repo", async (req, res) => {
  const id = `${req.params.owner}/${req.params.repo}`.toLowerCase();
  const plugin = await getCommunityPlugin(id);
  if (!plugin) {
    res
      .status(404)
      .json({ error: { code: "J4040", message: "Plugin not found." } });
    return;
  }
  res.json({ plugin });
});

async function refreshFromGithub(
  existing: CommunityPlugin,
  accessToken: string,
): Promise<
  | { ok: true; plugin: CommunityPlugin }
  | { ok: false; status: number; code: string; message: string }
> {
  const parsed = parseGitHubRepoUrl(existing.repository);
  if (!parsed) {
    return {
      ok: false,
      status: 400,
      code: "J4003",
      message: "Invalid repository URL.",
    };
  }
  const fetched = await fetchJadePluginJson(
    parsed.owner,
    parsed.repo,
    accessToken,
  );
  if (!fetched.ok) {
    return {
      ok: false,
      status: 422,
      code: "J4220",
      message: fetched.message,
    };
  }
  const errors = validateManifest(fetched.manifest);
  if (errors.length > 0) {
    return {
      ok: false,
      status: 422,
      code: "J4221",
      message: `Invalid jade-plugin.json: ${errors.join("; ")}`,
    };
  }
  return {
    ok: true,
    plugin: {
      ...existing,
      name: fetched.manifest.name.trim(),
      version: fetched.manifest.version.trim(),
      description: fetched.manifest.description.trim(),
      jade: fetched.manifest.jade.trim(),
      lua: fetched.manifest.lua?.trim() || undefined,
      main: fetched.manifest.main.trim(),
      keywords: Array.isArray(fetched.manifest.keywords)
        ? fetched.manifest.keywords.slice(0, 12).map((k) => String(k))
        : [],
      updatedAt: new Date().toISOString(),
    },
  };
}

function requireOwner(
  session: SessionUser | null,
  plugin: CommunityPlugin,
):
  | { ok: true; session: SessionUser }
  | { ok: false; status: number; code: string; message: string } {
  if (!session) {
    return {
      ok: false,
      status: 401,
      code: "J4010",
      message: "Sign in with GitHub to manage plugins.",
    };
  }
  if (plugin.owner.githubId !== session.githubId) {
    return {
      ok: false,
      status: 403,
      code: "J4032",
      message: "You can only manage your own listings.",
    };
  }
  return { ok: true, session };
}

pluginsRouter.patch("/:owner/:repo", async (req, res) => {
  const id = `${req.params.owner}/${req.params.repo}`.toLowerCase();
  const existing = await getCommunityPlugin(id);
  if (!existing) {
    res
      .status(404)
      .json({ error: { code: "J4040", message: "Plugin not found." } });
    return;
  }
  const authz = requireOwner(getSessionUser(req), existing);
  if (!authz.ok) {
    res
      .status(authz.status)
      .json({ error: { code: authz.code, message: authz.message } });
    return;
  }

  const rl = await rateLimit(`update:${authz.session.githubId}`, 10, 3600);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfterSec));
    res
      .status(429)
      .json({
        error: { code: "J4291", message: "Update rate limit reached." },
      });
    return;
  }

  const refreshed = await refreshFromGithub(
    existing,
    authz.session.accessToken,
  );
  if (!refreshed.ok) {
    res.status(refreshed.status).json({
      error: { code: refreshed.code, message: refreshed.message },
    });
    return;
  }
  await upsertCommunityPlugin(refreshed.plugin);
  res.json({ plugin: refreshed.plugin });
});

pluginsRouter.delete("/:owner/:repo", async (req, res) => {
  const id = `${req.params.owner}/${req.params.repo}`.toLowerCase();
  const existing = await getCommunityPlugin(id);
  if (!existing) {
    res
      .status(404)
      .json({ error: { code: "J4040", message: "Plugin not found." } });
    return;
  }
  const authz = requireOwner(getSessionUser(req), existing);
  if (!authz.ok) {
    res
      .status(authz.status)
      .json({ error: { code: authz.code, message: authz.message } });
    return;
  }
  await deleteCommunityPlugin(id);
  res.status(204).end();
});
