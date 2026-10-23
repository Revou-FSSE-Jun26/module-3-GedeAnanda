import type { ReactNode } from "react";
import Spinner from "./Spinner";

interface SubmitButtonProps {
  pending: boolean;
  pendingLabel: string;
  className?: string;
  children: ReactNode;
}

export default function SubmitButton({ pending, pendingLabel, className = "w-full", children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover disabled:cursor-wait disabled:opacity-80 ${className}`}
    >
      {pending && <Spinner />}
      {pending ? pendingLabel : children}
    </button>
  );
}
