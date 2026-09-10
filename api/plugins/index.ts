import type { IncomingMessage, ServerResponse } from "node:http";
import { clientIp, errorJson, json, readJsonBody } from "../_lib/http";
import {
  assertCanPublish,
  fetchJadePluginJson,
  parseGitHubRepoUrl,
  pluginIdFromRepo,
  validateManifest,
} from "../_lib/github";
import { getSession, publicUser } from "../_lib/session";
import {
  listCommunityPlugins,
  rateLimit,
  upsertCommunityPlugin,
} from "../_lib/store";
import type { CommunityPlugin } from "../_lib/types";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === "GET") {
    const rl = await rateLimit(`list:${clientIp(req)}`, 60, 60);
    if (!rl.ok) {
      res.setHeader("Retry-After", String(rl.retryAfterSec));
      errorJson(res, 429, "J4290", "Too many requests. Try again shortly.");
      return;
    }
    const plugins = await listCommunityPlugins();
    json(res, 200, { plugins });
    return;
  }

  if (req.method === "POST") {
    const session = getSession(req);
    if (!session) {
      errorJson(res, 401, "J4010", "Sign in with GitHub to submit a plugin.");
      return;
    }

    const rl = await rateLimit(`submit:${session.githubId}`, 5, 3600);
    if (!rl.ok) {
      res.setHeader("Retry-After", String(rl.retryAfterSec));
      errorJson(
        res,
        429,
        "J4291",
        "Submission rate limit reached (5 per hour). Try again later.",
      );
      return;
    }

    const body = await readJsonBody<{ repository?: string }>(req);
    const repoUrl = body?.repository?.trim();
    if (!repoUrl) {
      errorJson(res, 400, "J4002", "repository URL is required.");
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

    const access = await assertCanPublish(session, parsed.owner, parsed.repo);
    if (!access.ok) {
      errorJson(res, 403, "J4030", access.message);
      return;
    }

    const fetched = await fetchJadePluginJson(
      parsed.owner,
      parsed.repo,
      session.accessToken,
    );
    if (!fetched.ok) {
      errorJson(res, 422, "J4220", fetched.message);
      return;
    }

    const validationErrors = validateManifest(fetched.manifest);
    if (validationErrors.length > 0) {
      errorJson(
        res,
        422,
        "J4221",
        `Invalid jade-plugin.json: ${validationErrors.join("; ")}`,
      );
      return;
    }

    const id = pluginIdFromRepo(parsed.owner, parsed.repo);
    const now = new Date().toISOString();
    const existing = (await listCommunityPlugins()).find((p) => p.id === id);
    const canOverwrite =
      !existing || existing.owner.githubId === session.githubId;
    if (!canOverwrite) {
      errorJson(
        res,
        403,
        "J4031",
        "This repository is already listed by another author.",
      );
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
    json(res, existing ? 200 : 201, { plugin, user: publicUser(session) });
    return;
  }

  errorJson(res, 405, "J4001", "Method not allowed");
}
