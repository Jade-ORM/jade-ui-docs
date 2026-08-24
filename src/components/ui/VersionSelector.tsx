import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useVersion } from "../../contexts/VersionContext";

export default function VersionSelector() {
  const { currentVersion, setVersion, availableVersions } = useVersion();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-white"
      >
        {currentVersion.label}
        {currentVersion.isLatest && (
          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            latest
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {availableVersions.map((version) => (
            <button
              key={version.id}
              onClick={() => {
                setVersion(version.id);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm transition ${
                currentVersion.id === version.id
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                {version.label}
                {version.isLatest && (
                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                    latest
                  </span>
                )}
              </span>
              {currentVersion.id === version.id && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
