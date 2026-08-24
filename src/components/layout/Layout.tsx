import type { ReactNode } from "react";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { VersionProvider } from "../../contexts/VersionContext";
import { LanguageProvider } from "../../contexts/LanguageContext";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <VersionProvider>
          <div className="flex min-h-screen flex-col bg-white text-zinc-900 transition-colors dark:bg-[#09090b] dark:text-white">
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </VersionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
