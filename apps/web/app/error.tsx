"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 pt-12 pb-20 text-center">
      <p className="text-sm text-red-400">Something went wrong.</p>

      {process.env.NODE_ENV === "development" && error.stack && (
        <pre className="w-full overflow-auto rounded bg-zinc-900 p-4 text-left text-xs text-zinc-400">
          {error.stack}
        </pre>
      )}

      <button onClick={reset} className="text-sm text-zinc-400 underline">
        Try again
      </button>
    </main>
  );
}
