import type { OfficialPlugin } from "../types/plugin";

/**
 * Snapshot of Jade-ORM/plugins → registry.json (official-only).
 * Keep in sync with registry master (8 entries as of 0fbbf1e).
 * Runtime prefers fetchOfficialPlugins() live registry when available.
 */
export const officialPlugins: OfficialPlugin[] = [
  {
    name: "cache",
    version: "1.0.0",
    description: "In-memory query result cache with TTL",
    path: "official/cache",
    core_module: "jade.plugin.cache",
    jade: ">=1.6.0",
  },
  {
    name: "soft-delete",
    version: "1.0.0",
    description: "Soft delete via entity hooks",
    path: "official/soft-delete",
    core_module: "jade.plugin.soft_delete",
    jade: ">=1.6.0",
  },
  {
    name: "timestamps",
    version: "1.0.0",
    description: "Automatic created_at / updated_at on create and update",
    path: "official/timestamps",
    core_module: "jade.plugin.timestamps",
    jade: ">=2.0.0",
  },
  {
    name: "tenant",
    version: "0.1.0",
    description: "Automatic tenant_id injection on create",
    path: "official/tenant",
    core_module: "jade.plugin.tenant",
    jade: ">=2.0.0",
  },
  {
    name: "sql-log",
    version: "1.0.0",
    description: "Log SQL queries through jade.log",
    path: "official/sql-log",
    core_module: "jade.plugin.sql_log",
    jade: ">=2.0.0",
  },
  {
    name: "optimistic-lock",
    version: "1.0.0",
    description: "Optimistic concurrency control with version column",
    path: "official/optimistic-lock",
    core_module: "jade.plugin.optimistic_lock",
    jade: ">=2.0.0",
  },
  {
    name: "audit",
    version: "1.0.0",
    description: "Audit trail logging for entity CRUD operations",
    path: "official/audit",
    core_module: "jade.plugin.audit",
    jade: ">=2.0.0",
  },
  {
    name: "encryption",
    version: "1.0.0",
    description:
      "Field-level encryption with database-native or custom algorithms",
    path: "official/encryption",
    core_module: "jade.plugin.encryption",
    jade: ">=2.0.0",
  },
];

export const OFFICIAL_PLUGINS_REPO =
  "https://github.com/Jade-ORM/plugins/tree/main/official";

const REGISTRY_URL =
  "https://raw.githubusercontent.com/Jade-ORM/plugins/master/registry.json";

function isOfficialPlugin(value: unknown): value is OfficialPlugin {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.name === "string" &&
    typeof p.version === "string" &&
    typeof p.description === "string" &&
    typeof p.core_module === "string" &&
    typeof p.jade === "string"
  );
}

/** Live registry.json with snapshot fallback (offline / CORS / rate limit). */
export async function fetchOfficialPlugins(): Promise<OfficialPlugin[]> {
  try {
    const res = await fetch(REGISTRY_URL, { cache: "no-cache" });
    if (!res.ok) return officialPlugins;
    const data = (await res.json()) as { official?: unknown };
    if (!Array.isArray(data.official)) return officialPlugins;
    const plugins = data.official.filter(isOfficialPlugin);
    return plugins.length > 0 ? plugins : officialPlugins;
  } catch {
    return officialPlugins;
  }
}
