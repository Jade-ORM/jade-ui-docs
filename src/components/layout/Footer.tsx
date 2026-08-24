export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Jade
            </span>{" "}
            &copy; 2026
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a
              href="https://github.com/AlehandroSV/Jade"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-900 dark:hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://luarocks.org/modules/alehandrosv/jade"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-900 dark:hover:text-white"
            >
              LuaRocks
            </a>
            <a
              href="https://www.npmjs.com/package/@alehandrosv/esmeralda-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-900 dark:hover:text-white"
            >
              npm
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
