import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { CommunityPlugin } from "./types.js";

const LIST_KEY = "jade:plugins:community";

function kvConfigured(): boolean {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN),
  );
}

function kvEndpoint(): { url: string; token: string } {
  return {
    url:
      process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
    token:
      process.env.KV_REST_API_TOKEN ||
      process.env.UPSTASH_REDIS_REST_TOKEN ||
      "",
  };
}

async function redisCommand(...cmd: Array<string | number>): Promise<unknown> {
  const { url, token } = kvEndpoint();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  });
  if (!res.ok) throw new Error(`KV request failed (${res.status})`);
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result;
}

function localFile(): string {
  return join(process.cwd(), "backend", ".data", "community-plugins.json");
}

function readLocalList(): CommunityPlugin[] {
  try {
    const raw = readFileSync(localFile(), "utf8");
    const parsed = JSON.parse(raw) as CommunityPlugin[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalList(plugins: CommunityPlugin[]): void {
  const file = localFile();
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(plugins, null, 2), "utf8");
}

export async function listCommunityPlugins(): Promise<CommunityPlugin[]> {
  if (!kvConfigured()) return readLocalList();
  const raw = await redisCommand("GET", LIST_KEY);
  if (!raw || raw === "null" || raw === "(nil)") return [];
  try {
    const parsed = JSON.parse(String(raw)) as CommunityPlugin[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveCommunityPlugins(
  plugins: CommunityPlugin[],
): Promise<void> {
  if (!kvConfigured()) {
    writeLocalList(plugins);
    return;
  }
  await redisCommand("SET", LIST_KEY, JSON.stringify(plugins));
}

export async function getCommunityPlugin(
  id: string,
): Promise<CommunityPlugin | null> {
  const list = await listCommunityPlugins();
  return list.find((p) => p.id === id) ?? null;
}

export async function upsertCommunityPlugin(
  plugin: CommunityPlugin,
): Promise<CommunityPlugin> {
  const list = await listCommunityPlugins();
  const idx = list.findIndex((p) => p.id === plugin.id);
  if (idx >= 0) list[idx] = plugin;
  else list.push(plugin);
  list.sort((a, b) => a.name.localeCompare(b.name));
  await saveCommunityPlugins(list);
  return plugin;
}

export async function deleteCommunityPlugin(id: string): Promise<boolean> {
  const list = await listCommunityPlugins();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) return false;
  await saveCommunityPlugins(next);
  return true;
}

export async function rateLimit(
  bucket: string,
  limit: number,
  windowSec: number,
): Promise<{ ok: boolean; remaining: number; retryAfterSec: number }> {
  const window = Math.floor(Date.now() / 1000 / windowSec);
  const key = `jade:rl:${bucket}:${window}`;
  if (!kvConfigured()) {
    return { ok: true, remaining: limit, retryAfterSec: 0 };
  }
  const countRaw = await redisCommand("INCR", key);
  const count = Number(countRaw ?? 1);
  if (count === 1) {
    await redisCommand("EXPIRE", key, String(windowSec));
  }
  const ok = count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - count),
    retryAfterSec: ok ? 0 : windowSec,
  };
}
