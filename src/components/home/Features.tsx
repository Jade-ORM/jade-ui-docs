import { useLanguage } from "../../contexts/LanguageContext";

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      labelKey: "features.declarative.title" as const,
      descKey: "features.declarative.desc" as const,
    },
    {
      labelKey: "features.query.title" as const,
      descKey: "features.query.desc" as const,
    },
    {
      labelKey: "features.migrations.title" as const,
      descKey: "features.migrations.desc" as const,
    },
    {
      labelKey: "features.relations.title" as const,
      descKey: "features.relations.desc" as const,
    },
    {
      labelKey: "features.transactions.title" as const,
      descKey: "features.transactions.desc" as const,
    },
    {
      labelKey: "features.security.title" as const,
      descKey: "features.security.desc" as const,
    },
  ];

  return (
    <section className="border-t border-zinc-200 py-20 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-12 text-2xl font-semibold text-zinc-900 dark:text-white">
          {t("features.title")}
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.labelKey}>
              <h3 className="mb-1 font-medium text-zinc-900 dark:text-white">
                {t(f.labelKey)}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
                {t(f.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
