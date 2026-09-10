import type { JadePluginManifest, SessionUser } from "./types";

export interface ParsedRepo {
  owner: string;
  repo: string;
}

const NAME_RE = /^[a-z0-9]+(?:[-_.][a-z0-9]+)*$/i;
const SEMVER_RE = /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/;

export function parseGitHubRepoUrl(input: string): ParsedRepo | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (host !== "github.com" && host !== "www.github.com") return null;
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");
  if (!NAME_RE.test(owner) || !NAME_RE.test(repo)) return null;
  return { owner, repo };
}

export function pluginIdFromRepo(owner: string, repo: string): string {
  return `${owner}/${repo}`.toLowerCase();
}

function ghHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "jade-docs-plugin-portal",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function fetchJadePluginJson(
  owner: string,
  repo: string,
  token?: string,
): Promise<
  { ok: true; manifest: JadePluginManifest } | { ok: false; message: string }
> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/jade-plugin.json`;
  const res = await fetch(url, {
    headers: { ...ghHeaders(token), Accept: "application/vnd.github.raw+json" },
  });
  if (res.status === 404) {
    return {
      ok: false,
      message:
        "jade-plugin.json not found at the repository root. Add it and try again.",
    };
  }
  if (!res.ok) {
    return {
      ok: false,
      message: `GitHub API error while reading jade-plugin.json (${res.status}).`,
    };
  }
  const text = await res.text();
  try {
    const manifest = JSON.parse(text) as JadePluginManifest;
    return { ok: true, manifest };
  } catch {
    return { ok: false, message: "jade-plugin.json is not valid JSON." };
  }
}

export function validateManifest(manifest: JadePluginManifest): string[] {
  const errors: string[] = [];
  if (typeof manifest.name !== "string" || !manifest.name.trim()) {
    errors.push("name is required");
  } else if (!NAME_RE.test(manifest.name.trim())) {
    errors.push("name must be a slug (letters, numbers, - _ .)");
  }
  if (
    typeof manifest.version !== "string" ||
    !SEMVER_RE.test(manifest.version)
  ) {
    errors.push("version must be semver (e.g. 1.0.0)");
  }
  if (
    typeof manifest.description !== "string" ||
    !manifest.description.trim()
  ) {
    errors.push("description is required");
  } else if (manifest.description.length > 200) {
    errors.push("description must be at most 200 characters");
  }
  if (typeof manifest.jade !== "string" || !manifest.jade.trim()) {
    errors.push('jade compat range is required (e.g. ">=2.0.0")');
  }
  if (typeof manifest.main !== "string" || !manifest.main.trim()) {
    errors.push("main entry file is required (e.g. src/init.lua)");
  } else if (
    manifest.main.includes("..") ||
    manifest.main.startsWith("/") ||
    manifest.main.includes("\\")
  ) {
    errors.push("main must be a relative path inside the repository");
  }
  if (typeof manifest.repository !== "string" || !manifest.repository.trim()) {
    errors.push("repository URL is required");
  } else {
    const parsed = parseGitHubRepoUrl(manifest.repository);
    if (!parsed) errors.push("repository must be a github.com URL");
  }
  if (manifest.keywords !== undefined) {
    if (!Array.isArray(manifest.keywords)) {
      errors.push("keywords must be an array of strings");
    } else if (manifest.keywords.some((k) => typeof k !== "string")) {
      errors.push("keywords must be strings");
    }
  }
  return errors;
}

export type PublishAccess = { ok: true } | { ok: false; message: string };

export async function assertCanPublish(
  user: SessionUser,
  owner: string,
  repo: string,
): Promise<PublishAccess> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: ghHeaders(user.accessToken),
  });
  if (res.status === 404) {
    return { ok: false, message: "Repository not found on GitHub." };
  }
  if (!res.ok) {
    return {
      ok: false,
      message: `GitHub API error while checking the repository (${res.status}).`,
    };
  }
  const data = (await res.json()) as {
    private?: boolean;
    archived?: boolean;
    disabled?: boolean;
    owner?: { login?: string; type?: string };
  };
  if (data.private) {
    return {
      ok: false,
      message: "Repository must be public to be listed as a community plugin.",
    };
  }
  if (data.disabled) {
    return { ok: false, message: "Repository is disabled on GitHub." };
  }
  const login = user.login.toLowerCase();
  const ownerLogin = (data.owner?.login || "").toLowerCase();
  if (ownerLogin === login) return { ok: true };

  if ((data.owner?.type || "").toLowerCase() === "organization") {
    const mem = await fetch(
      `https://api.github.com/orgs/${ownerLogin}/public_members/${user.login}`,
      { headers: ghHeaders(user.accessToken) },
    );
    if (mem.ok) return { ok: true };
    return {
      ok: false,
      message:
        "You can only publish repositories you own, or public org repos where you are a public member.",
    };
  }

  return {
    ok: false,
    message:
      "You can only publish repositories you own, or public org repos where you are a public member.",
  };
}
