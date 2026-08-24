import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CodeBlock from "../ui/CodeBlock";
import { useLanguage } from "../../contexts/LanguageContext";

const codeExample = `local jade = require("jade")

jade.configure({
  database = {
    driver = "postgresql",
    host = "localhost",
    database = "myapp"
  }
})

local User = jade.Entity("users", {
  id = jade.Integer():primaryKey(),
  name = jade.String(120),
  email = jade.String():unique(),
})

User:create({ name = "Lucas", email = "lucas@email.com" })
local users = User:where(User.active:eq(true)):get()`;

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-3xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-white">
            {t("home.title")}
          </h1>
          <p className="mb-8 text-base leading-relaxed text-zinc-500 sm:text-lg dark:text-zinc-400">
            {t("home.subtitle")}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/docs/quick-start"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {t("home.quickStart")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/api"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {t("home.apiReference")}
            </Link>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <CodeBlock code={codeExample} language="lua" />
        </div>
      </div>
    </section>
  );
}
