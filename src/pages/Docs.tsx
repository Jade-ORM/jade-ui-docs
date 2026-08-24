import { useParams, Link } from "react-router-dom";
import { useVersion } from "../contexts/VersionContext";
import { useLanguage } from "../contexts/LanguageContext";
import { docsSidebar } from "../data/navigation";
import { docsSectionsPtBr } from "../data/docs-pt-br";
import DocRenderer from "../components/ui/DocRenderer";

export default function Docs() {
  const { section = "introduction" } = useParams();
  const { currentVersion } = useVersion();
  const { language, t } = useLanguage();

  // Use translated sections when available
  const sections =
    language === "pt-br"
      ? currentVersion.sections.map((s) => {
          const translated = docsSectionsPtBr.find((ts) => ts.id === s.id);
          return translated || s;
        })
      : currentVersion.sections;

  const current = sections.find((s) => s.id === section) || sections[0];

  // Filter sidebar to only show sections available in current version
  const availableSectionIds = new Set(currentVersion.sections.map((s) => s.id));

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Fixed sidebar */}
      <aside className="hidden w-64 flex-shrink-0 overflow-y-auto border-r border-zinc-200 lg:block dark:border-zinc-800">
        <nav className="space-y-6 p-4">
          {docsSidebar.map((group, groupIndex) => {
            const availableChildren = group.children?.filter((child) =>
              availableSectionIds.has(child.href.split("/").pop() || ""),
            );

            if (!availableChildren || availableChildren.length === 0)
              return null;

            return (
              <div key={group.href}>
                {groupIndex > 0 && (
                  <div className="mb-4 border-t border-zinc-100 dark:border-zinc-800" />
                )}
                <div className="mb-2 px-3 text-[11px] font-bold tracking-[0.1em] text-zinc-400 uppercase dark:text-zinc-500">
                  {t(group.labelKey as any)}
                </div>
                <div className="space-y-0.5">
                  {availableChildren.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`block rounded-md px-3 py-1.5 text-[13px] transition ${
                        link.href.includes(section)
                          ? "border-l-2 border-emerald-500 bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
                      }`}
                    >
                      {t(link.labelKey as any)}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {current.title}
            </h1>
            {!currentVersion.isLatest && (
              <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                {currentVersion.label}
              </span>
            )}
          </div>
          {current.description && (
            <p className="mb-8 text-zinc-500 dark:text-zinc-400">
              {current.description}
            </p>
          )}
          <div className="text-zinc-300">
            <DocRenderer content={current.content} />
          </div>
        </div>
      </main>
    </div>
  );
}
