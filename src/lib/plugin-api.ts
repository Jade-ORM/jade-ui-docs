import type {
  CommunityListResponse,
  CommunityPlugin,
  MeResponse,
  SessionUser,
} from "../types/plugin";

export class PluginApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "PluginApiError";
    this.status = status;
    this.code = code;
  }
}

async function parseError(res: Response): Promise<PluginApiError> {
  let code = "J5000";
  let message = `Request failed (${res.status})`;
  try {
    const data = (await res.json()) as {
      error?: { code?: string; message?: string };
    };
    if (data.error?.code) code = data.error.code;
    if (data.error?.message) message = data.error.message;
  } catch {
    // keep defaults
  }
  return new PluginApiError(res.status, code, message);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "same-origin",
    headers: init?.body
      ? { "Content-Type": "application/json", ...(init.headers || {}) }
      : init?.headers,
    ...init,
  });
  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function loginUrl(): string {
  return "/api/auth/login";
}

export async function fetchMe(): Promise<SessionUser | null> {
  const data = await request<MeResponse>("/api/auth/me");
  return data.user;
}

export async function logout(): Promise<void> {
  await request("/api/auth/logout", { method: "POST" });
}

export async function listCommunityPlugins(): Promise<CommunityPlugin[]> {
  const data = await request<CommunityListResponse>("/api/plugins");
  return data.plugins;
}

export async function submitPlugin(
  repository: string,
): Promise<CommunityPlugin> {
  const data = await request<{ plugin: CommunityPlugin }>("/api/plugins", {
    method: "POST",
    body: JSON.stringify({ repository }),
  });
  return data.plugin;
}

export async function refreshPlugin(id: string): Promise<CommunityPlugin> {
  const data = await request<{ plugin: CommunityPlugin }>(
    `/api/plugins/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify({}) },
  );
  return data.plugin;
}

export async function removePlugin(id: string): Promise<void> {
  await request(`/api/plugins/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Lightweight client-side URL check (server re-validates). */
export function isLikelyGitHubRepoUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") return false;
    const parts = url.pathname.split("/").filter(Boolean);
    return parts.length >= 2;
  } catch {
    return false;
  }
}
