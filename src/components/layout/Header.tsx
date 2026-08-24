import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { mainNav } from "../../data/navigation";
import VersionSelector from "../ui/VersionSelector";
import LanguageSelector from "../ui/LanguageSelector";
import Logo from "../ui/Logo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#09090b]/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  location.pathname.startsWith(link.href)
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {t(link.labelKey as any)}
              </Link>
            ))}
            <a
              href="https://github.com/AlehandroSV/Jade"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://luarocks.org/modules/alehandrosv/jade"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm text-zinc-500 transition hover:text-zinc-900 sm:inline-flex dark:text-zinc-400 dark:hover:text-white"
            >
              {t("nav.install")}
            </a>

            <LanguageSelector />
            <VersionSelector />

            <button
              onClick={toggleTheme}
              className="p-1.5 text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 md:hidden dark:text-zinc-400 dark:hover:text-white"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-[#09090b]">
          <div className="space-y-1 px-4 py-3">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {t(link.labelKey as any)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
