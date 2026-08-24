import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-8xl font-bold text-emerald-500">404</h1>
        <p className="mb-8 text-xl text-zinc-500 dark:text-zinc-400">
          Page not found
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-500"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
