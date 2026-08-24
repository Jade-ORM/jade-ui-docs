import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-zinc-200 p-8 text-center sm:p-12 dark:border-zinc-800">
          <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-white">
            {t("cta.title")}
          </h2>
          <p className="mb-6 text-zinc-500 dark:text-zinc-400">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/docs/installation"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {t("cta.readDocs")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <code className="font-mono text-sm text-zinc-500 dark:text-zinc-500">
              luarocks install jade
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}
