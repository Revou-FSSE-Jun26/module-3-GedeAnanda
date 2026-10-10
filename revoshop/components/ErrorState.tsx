"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

interface ErrorStateProps {
  error: Error & { digest?: string };
  retry: () => void;
  title?: string;
}

// Shared body for every route's error.tsx.
export default function ErrorState({ error, retry, title = "Something went wrong" }: ErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-danger-soft text-danger">
        <WarningCircle size={28} aria-hidden />
      </span>
      <h1 className="mt-5 text-xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        The RevoShop API did not respond the way we expected. It may be offline or starting up. Wait a
        moment, then try again.
      </p>
      {error.digest && <p className="mt-3 font-mono text-xs text-subtle">Reference {error.digest}</p>}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition-[background-color,transform] duration-200 hover:bg-accent-hover active:scale-[0.98]"
        >
          <ArrowClockwise size={16} weight="bold" aria-hidden />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-sunken"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
