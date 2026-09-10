import type { OfficialPlugin } from "../types/plugin";

/** Snapshot of Jade-ORM/plugins → registry.json (official-only). */
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
];

export const OFFICIAL_PLUGINS_REPO =
  "https://github.com/Jade-ORM/plugins/tree/main/official";
