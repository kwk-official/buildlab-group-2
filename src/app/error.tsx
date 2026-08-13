"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mb-4 text-5xl">😬</div>
      <h1 className="text-2xl font-extrabold text-slate-900">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md leading-7 text-slate-600">
        {error.message.includes("SQLITE") ||
        error.message.includes("no such table")
          ? "It looks like the database isn't set up yet. Run these commands in your terminal:"
          : "An unexpected error occurred. Try refreshing the page."}
      </p>

      {(error.message.includes("SQLITE") ||
        error.message.includes("no such table")) && (
        <pre className="mt-4 rounded-xl bg-slate-900 p-4 text-left text-sm text-slate-100">
          {`pnpm run db:push\npnpm run seed`}
        </pre>
      )}

      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-kwk-purple px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-kwk-space hover:shadow-md"
      >
        Try again
      </button>
    </div>
  );
}
