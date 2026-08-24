import { examples } from "../data/examples";
import CodeBlock from "../components/ui/CodeBlock";
import { useLanguage } from "../contexts/LanguageContext";

export default function Examples() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {t("examples.title")}
      </h1>
      <p className="mb-10 text-zinc-500 dark:text-zinc-400">
        {t("examples.description")}
      </p>

      <div className="space-y-12">
        {examples.map((example) => (
          <section key={example.id}>
            <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
              {example.title}
            </h2>
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
              {example.description}
            </p>
            <CodeBlock code={example.code} language={example.language} />
          </section>
        ))}
      </div>
    </div>
  );
}
