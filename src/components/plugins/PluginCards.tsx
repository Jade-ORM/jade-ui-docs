import type { CommunityPlugin, OfficialPlugin } from "../../types/plugin";
import { OFFICIAL_PLUGINS_REPO } from "../../data/official-plugins";
import { useLanguage } from "../../contexts/LanguageContext";

interface OfficialCardProps {
  plugin: OfficialPlugin;
}

export function OfficialPluginCard({ plugin }: OfficialCardProps) {
  const { t } = useLanguage();
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
            {plugin.name}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {plugin.description}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {t("plugins.officialBadge")}
        </span>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-[11px] text-zinc-400 dark:text-zinc-500">
        <span className="font-mono">v{plugin.version}</span>
        <span>·</span>
        <span className="font-mono">{plugin.jade}</span>
        <span>·</span>
        <span className="font-mono">{plugin.core_module}</span>
        <a
          href={`${OFFICIAL_PLUGINS_REPO}/${plugin.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-emerald-600 hover:underline dark:text-emerald-400"
        >
          {t("plugins.viewSource")}
        </a>
      </div>
    </article>
  );
}

interface CommunityCardProps {
  plugin: CommunityPlugin;
  isOwner: boolean;
  onRefresh: (plugin: CommunityPlugin) => void;
  onDelete: (plugin: CommunityPlugin) => void;
  busy: boolean;
}

export function CommunityPluginCard({
  plugin,
  isOwner,
  onRefresh,
  onDelete,
  busy,
}: CommunityCardProps) {
  const { t } = useLanguage();
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-mono text-sm font-semibold text-zinc-900 dark:text-white">
            {plugin.name}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {plugin.description}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {t("plugins.communityBadge")}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
        <span className="font-mono">v{plugin.version}</span>
        <span>·</span>
        <span className="font-mono">{plugin.jade}</span>
        {plugin.keywords.slice(0, 3).map((k) => (
          <span
            key={k}
            className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {k}
          </span>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <a
          href={plugin.repository}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
        >
          {t("plugins.viewRepo")}
        </a>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          @{plugin.owner.login}
        </span>
        {isOwner && (
          <span className="ml-auto flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => onRefresh(plugin)}
              className="rounded-md px-2 py-1 text-[11px] text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {t("plugins.refresh")}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onDelete(plugin)}
              className="rounded-md px-2 py-1 text-[11px] text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
            >
              {t("plugins.remove")}
            </button>
          </span>
        )}
      </div>
    </article>
  );
}
