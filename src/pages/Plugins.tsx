import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, LogOut, Loader2, ChevronDown } from "lucide-react";
import { GitHubMark } from "../components/ui/GitHubMark";
import CodeBlock from "../components/ui/CodeBlock";
import SubmitPluginModal from "../components/plugins/SubmitPluginModal";
import {
  CommunityPluginCard,
  OfficialPluginCard,
} from "../components/plugins/PluginCards";
import {
  fetchOfficialPlugins,
  officialPlugins as officialPluginsFallback,
} from "../data/official-plugins";
import type { CommunityPlugin, OfficialPlugin } from "../types/plugin";
import { pluginExamples } from "../data/plugins-data";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  listCommunityPlugins,
  loginUrl,
  refreshPlugin,
  removePlugin,
} from "../lib/plugin-api";

export default function Plugins() {
  const { t } = useLanguage();
  const { user, loading: authLoading, logout, refresh } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [official, setOfficial] = useState<OfficialPlugin[]>(
    officialPluginsFallback,
  );
  const [community, setCommunity] = useState<CommunityPlugin[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const plugins = await listCommunityPlugins();
      setCommunity(plugins);
    } catch {
      setListError(t("plugins.errList"));
      setCommunity([]);
    } finally {
      setLoadingList(false);
    }
  }, [t]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    let cancelled = false;
    void fetchOfficialPlugins().then((plugins) => {
      if (!cancelled) setOfficial(plugins);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void refresh();
    const oauthError = searchParams.get("auth_error");
    if (oauthError) setAuthError(oauthError);
    if (oauthError || searchParams.get("auth")) {
      const next = new URLSearchParams(searchParams);
      next.delete("auth");
      next.delete("auth_error");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, refresh]);

  const handleRefresh = async (plugin: CommunityPlugin) => {
    setBusyId(plugin.id);
    try {
      const updated = await refreshPlugin(plugin.id);
      setCommunity((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
    } catch {
      // keep list as-is; user can retry
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (plugin: CommunityPlugin) => {
    if (!window.confirm(t("plugins.confirmDelete"))) return;
    setBusyId(plugin.id);
    try {
      await removePlugin(plugin.id);
      setCommunity((prev) => prev.filter((p) => p.id !== plugin.id));
    } catch {
      // ignore
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {t("plugins.title")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {t("plugins.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {authLoading ? (
            <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : user ? (
            <>
              <span className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-5 w-5 rounded-full"
                  referrerPolicy="no-referrer"
                />
                @{user.login}
              </span>
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                title={t("plugins.signOut")}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">
                  {t("plugins.signOut")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                <Plus className="h-4 w-4" />
                {t("plugins.submit")}
              </button>
            </>
          ) : (
            <>
              <a
                href={loginUrl()}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <GitHubMark className="h-4 w-4" />
                {t("plugins.signIn")}
              </a>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                <Plus className="h-4 w-4" />
                {t("plugins.submit")}
              </button>
            </>
          )}
        </div>
      </div>

      {authError && (
        <div className="mb-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {t("plugins.authError")}
        </div>
      )}

      {/* Official */}
      <section className="mb-12">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            {t("plugins.official")}
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {t("plugins.officialHint")}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {official.map((plugin) => (
            <OfficialPluginCard key={plugin.name} plugin={plugin} />
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="mb-16">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            {t("plugins.community")}
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {t("plugins.communityHint")}
          </p>
        </div>

        {loadingList ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-zinc-200 px-4 py-8 text-sm text-zinc-400 dark:border-zinc-800">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("plugins.loading")}
          </div>
        ) : listError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {listError}
          </div>
        ) : community.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 px-4 py-10 text-center dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("plugins.empty")}
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" />
              {t("plugins.submit")}
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {community.map((plugin) => (
              <CommunityPluginCard
                key={plugin.id}
                plugin={plugin}
                isOwner={user?.githubId === plugin.owner.githubId}
                onRefresh={(p) => void handleRefresh(p)}
                onDelete={(p) => void handleDelete(p)}
                busy={busyId === plugin.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Author guide (collapsible) */}
      <section className="mb-12">
        <button
          type="button"
          onClick={() => setGuideOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left dark:border-zinc-800 dark:bg-zinc-900"
        >
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            {t("plugins.guideToggle")}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-zinc-400 transition-transform ${
              guideOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {guideOpen && (
          <div className="mt-8 space-y-12">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
                {t("plugins.guideContract")}
              </h2>
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                {t("plugins.guideContractDesc")}
              </p>
              <CodeBlock
                title="jade-plugin.json"
                language="json"
                code={`{
  "name": "acme-tenant",
  "version": "1.0.0",
  "description": "Multi-tenant scoping for Jade entities",
  "jade": ">=2.0.0",
  "lua": ">=5.1",
  "main": "src/init.lua",
  "repository": "https://github.com/acme/jade-plugin-tenant",
  "keywords": ["tenant", "multi-tenant"]
}`}
              />
              <p className="mt-4 mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                {t("plugins.guideLua")}
              </p>
              <CodeBlock
                title="src/init.lua"
                language="lua"
                code={`local M = {}

M.name        = "acme-tenant"
M.version     = "1.0.0"
M.description = "Multi-tenant scoping for Jade entities"

function M.setup(jade, opts)
    opts = opts or {}
    -- install hooks / validate config
    return true
end

return M`}
              />
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
                {t("plugins.guideInterface")}
              </h2>
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                {t("plugins.guideInterfaceDesc")}
              </p>
              <CodeBlock
                code={`local M = {}

M.name        = "meu-plugin"
M.version     = "1.0.0"
M.description = "Descrição curta"

M.hooks = {
    beforeQuery  = function(ctx) print("SQL:", ctx.sql) end,
    afterCreate  = function(ctx) print("Criado:", ctx.entity._table) end,
    extendEntity = function(ctx)
        local entity = ctx.entity
        function entity:findOrCreate(cond, defaults)
            local record = self:where(cond):first()
            if record then return record end
            return self:create(defaults or {})
        end
    end,
}

function M.setup(jade, opts)
    return true
end

function M.teardown(jade)
end

return M`}
                language="lua"
              />
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
                {t("plugins.guideHooks")}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">
                        Hook
                      </th>
                      <th className="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">
                        Context
                      </th>
                      <th className="py-2 font-medium text-zinc-700 dark:text-zinc-300">
                        When
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-600 dark:text-zinc-400">
                    {[
                      ["beforeQuery", "{ sql, bindings }", "Before query"],
                      ["afterQuery", "{ sql, bindings, rows }", "After query"],
                      ["beforeConnect", "{ config }", "Before connect"],
                      ["afterConnect", "{ connection_id }", "After connect"],
                      [
                        "beforeCreate",
                        "{ entity, instance?, data }",
                        "Before INSERT",
                      ],
                      [
                        "afterCreate",
                        "{ entity, instance, data }",
                        "After INSERT",
                      ],
                      [
                        "beforeUpdate",
                        "{ entity, instance?, data }",
                        "Before UPDATE",
                      ],
                      [
                        "afterUpdate",
                        "{ entity, instance, data }",
                        "After UPDATE",
                      ],
                      [
                        "beforeDelete",
                        "{ entity, instance? }",
                        "Before DELETE",
                      ],
                      ["afterDelete", "{ entity, instance }", "After DELETE"],
                      ["extendEntity", "{ entity }", "New Entity"],
                      ["extendQuery", "{ query }", "New Query builder"],
                      ["extendDriver", "{ driver }", "New Driver"],
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <td className="py-2 pr-4 font-mono text-emerald-600 dark:text-emerald-400">
                          {row[0]}
                        </td>
                        <td className="py-2 pr-4 font-mono text-xs">
                          {row[1]}
                        </td>
                        <td className="py-2">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-white">
                {t("plugins.guideExamples")}
              </h2>
              <div className="space-y-12">
                {pluginExamples.map((example) => (
                  <section key={example.id}>
                    <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                      {example.title}
                    </h3>
                    <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {example.description}
                    </p>
                    <CodeBlock
                      code={example.code}
                      language={example.language}
                    />
                  </section>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>

      <SubmitPluginModal
        open={modalOpen}
        user={user}
        onClose={() => setModalOpen(false)}
        onSubmitted={() => {
          void loadList();
        }}
      />
    </div>
  );
}
