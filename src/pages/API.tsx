import { entityMethods, conditionOperators } from "../data/api";
import CodeBlock from "../components/ui/CodeBlock";
import { useLanguage } from "../contexts/LanguageContext";

export default function API() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {t("api.title")}
      </h1>
      <p className="mb-10 text-zinc-500 dark:text-zinc-400">
        {t("api.description")}
      </p>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {t("api.entityMethods")}
        </h2>
        <div className="space-y-8">
          {entityMethods.map((method) => (
            <div
              key={method.name}
              className="border-b border-zinc-200 pb-8 dark:border-zinc-800"
            >
              <h3 className="mb-1 font-mono text-lg font-semibold text-zinc-900 dark:text-white">
                {method.signature}
              </h3>
              <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                {method.description}
              </p>
              <p className="mb-3 text-xs text-zinc-400 dark:text-zinc-500">
                {t("api.returns")}:{" "}
                <code className="text-emerald-500 dark:text-emerald-400">
                  {method.returns}
                </code>
              </p>
              <CodeBlock code={method.example} language="lua" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {t("api.conditionOperators")}
        </h2>
        <div className="space-y-6">
          {conditionOperators.map((op) => (
            <div
              key={op.name}
              className="border-b border-zinc-200 pb-6 dark:border-zinc-800"
            >
              <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-white">
                <span className="text-emerald-500 dark:text-emerald-400">
                  {op.symbol}
                </span>
                <span className="ml-3 text-sm font-normal text-zinc-400 dark:text-zinc-500">
                  {op.description}
                </span>
              </h3>
              <CodeBlock code={op.example} language="lua" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
