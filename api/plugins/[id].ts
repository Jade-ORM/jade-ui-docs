import type { IncomingMessage, ServerResponse } from "node:http";
import { errorJson, json, noContent, readJsonBody } from "../_lib/http";
import {
  fetchJadePluginJson,
  parseGitHubRepoUrl,
  validateManifest,
} from "../_lib/github";
import { getSession } from "../_lib/session";
import {
  deleteCommunityPlugin,
  getCommunityPlugin,
  rateLimit,
  upsertCommunityPlugin,
} from "../_lib/store";

function decodeId(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const url = new URL(req.url || "/", "http://localhost");
  // /api/plugins/:id  (id may contain a slash as owner/repo)
  const match = url.pathname.match(/^\/api\/plugins\/(.+)$/);
  const id = decodeId(match?.[1]);
  if (!id) {
    errorJson(res, 400, "J4002", "Plugin id is required.");
    return;
  }

  if (req.method === "GET") {
    const plugin = await getCommunityPlugin(id);
    if (!plugin) {
      errorJson(res, 404, "J4040", "Plugin not found.");
      return;
    }
    json(res, 200, { plugin });
    return;
  }

  const session = getSession(req);
  if (!session) {
    errorJson(res, 401, "J4010", "Sign in with GitHub to manage plugins.");
    return;
  }

  const existing = await getCommunityPlugin(id);
  if (!existing) {
    errorJson(res, 404, "J4040", "Plugin not found.");
    return;
  }
  if (existing.owner.githubId !== session.githubId) {
    errorJson(res, 403, "J4032", "You can only manage your own listings.");
    return;
  }

  if (req.method === "PATCH") {
    const rl = await rateLimit(`update:${session.githubId}`, 10, 3600);
    if (!rl.ok) {
      res.setHeader("Retry-After", String(rl.retryAfterSec));
      errorJson(res, 429, "J4291", "Update rate limit reached.");
      return;
    }

    const body = await readJsonBody<{ repository?: string }>(req);
    const repoUrl = body?.repository?.trim();
    if (!repoUrl) {
      // Refresh from the original repository when no URL is provided.
      const parsed = parseGitHubRepoUrl(existing.repository);
      if (!parsed) {
        errorJson(res, 400, "J4003", "Invalid stored repository URL.");
        return;
      }
      const refreshed = await refreshPlugin(existing, session.accessToken);
      if (!refreshed.ok) {
        errorJson(res, 422, "J4220", refreshed.message);
        return;
      }
      await upsertCommunityPlugin(refreshed.plugin);
      json(res, 200, { plugin: refreshed.plugin });
      return;
    }

    const parsed = parseGitHubRepoUrl(repoUrl);
    if (!parsed) {
      errorJson(
        res,
        400,
        "J4003",
        "Only github.com repository URLs are accepted.",
      );
      return;
    }
    const newId = `${parsed.owner}/${parsed.repo}`.toLowerCase();
    if (newId !== id) {
      errorJson(
        res,
        400,
        "J4004",
        "Changing the repository creates a new listing. Delete this one first.",
      );
      return;
    }

    const refreshed = await refreshPlugin(
      {
        ...existing,
        repository: `https://github.com/${parsed.owner}/${parsed.repo}`,
      },
      session.accessToken,
    );
    if (!refreshed.ok) {
      errorJson(res, 422, "J4220", refreshed.message);
      return;
    }
    await upsertCommunityPlugin(refreshed.plugin);
    json(res, 200, { plugin: refreshed.plugin });
    return;
  }

  if (req.method === "DELETE") {
    const removed = await deleteCommunityPlugin(id);
    if (!removed) {
      errorJson(res, 404, "J4040", "Plugin not found.");
      return;
    }
    noContent(res);
    return;
  }

  errorJson(res, 405, "J4001", "Method not allowed");
}

async function refreshPlugin(
  existing: Awaited<ReturnType<typeof getCommunityPlugin>> & object,
  accessToken: string,
): Promise<
  | {
      ok: true;
      plugin: NonNullable<Awaited<ReturnType<typeof getCommunityPlugin>>>;
    }
  | { ok: false; message: string }
> {
  const parsed = parseGitHubRepoUrl(existing.repository);
  if (!parsed) {
    return { ok: false, message: "Invalid repository URL." };
  }
  const fetched = await fetchJadePluginJson(
    parsed.owner,
    parsed.repo,
    accessToken,
  );
  if (!fetched.ok) return { ok: false, message: fetched.message };
  const errors = validateManifest(fetched.manifest);
  if (errors.length > 0) {
    return {
      ok: false,
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
