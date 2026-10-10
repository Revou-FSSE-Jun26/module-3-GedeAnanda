"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorStateProps {
  error: Error & { digest?: string };
  retry: () => void;
  title?: string;
}

export default function ErrorState({ error, retry, title = "Something went wrong" }: ErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-lg font-bold text-ink">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        The RevoShop server did not respond. It may be offline or starting up. Wait a moment, then try again.
      </p>
      {error.digest && <p className="mt-2 font-mono text-xs text-subtle">Error code {error.digest}</p>}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => retry()}
          className="h-10 rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-lg border border-line bg-surface px-5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-sunken"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
