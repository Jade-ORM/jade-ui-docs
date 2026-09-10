import { useEffect, useState, type FormEvent } from "react";
import { X, Loader2 } from "lucide-react";
import { GitHubMark } from "../ui/GitHubMark";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  isLikelyGitHubRepoUrl,
  loginUrl,
  PluginApiError,
  submitPlugin,
} from "../../lib/plugin-api";
import type { CommunityPlugin, SessionUser } from "../../types/plugin";

interface SubmitPluginModalProps {
  open: boolean;
  user: SessionUser | null;
  onClose: () => void;
  onSubmitted: (plugin: CommunityPlugin) => void;
}

export default function SubmitPluginModal({
  open,
  user,
  onClose,
  onSubmitted,
}: SubmitPluginModalProps) {
  const { t } = useLanguage();
  const [repoUrl, setRepoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<CommunityPlugin | null>(null);

  useEffect(() => {
    if (!open) {
      setRepoUrl("");
      setError(null);
      setSuccess(null);
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isLikelyGitHubRepoUrl(repoUrl)) {
      setError(t("plugins.errUrl"));
      return;
    }
    setSubmitting(true);
    try {
      const plugin = await submitPlugin(repoUrl.trim());
      setSuccess(plugin);
      onSubmitted(plugin);
    } catch (err) {
      if (err instanceof PluginApiError) {
        setError(err.message);
      } else {
        setError(t("plugins.errGeneric"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-plugin-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="submit-plugin-title"
              className="text-lg font-semibold text-zinc-900 dark:text-white"
            >
              {t("plugins.submitTitle")}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {t("plugins.submitSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white"
            aria-label={t("plugins.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!user ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {t("plugins.signInRequired")}
            </p>
            <a
              href={loginUrl()}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <GitHubMark className="h-4 w-4" />
              {t("plugins.signIn")}
            </a>
          </div>
        ) : success ? (
          <div className="space-y-3">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {t("plugins.submitSuccess")}
            </p>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {success.name}@{success.version}
              <div className="mt-1 font-sans text-[11px] text-zinc-500">
                {success.repository}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              {t("plugins.close")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="repo-url"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {t("plugins.repoLabel")}
              </label>
              <input
                id="repo-url"
                type="url"
                required
                placeholder="https://github.com/acme/jade-plugin-tenant"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 transition outline-none placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                {t("plugins.repoHint")}
              </p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {t("plugins.signedInAs")}{" "}
                <span className="font-medium text-zinc-600 dark:text-zinc-300">
                  @{user.login}
                </span>
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("plugins.submitCta")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
