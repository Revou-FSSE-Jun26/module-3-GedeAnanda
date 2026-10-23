import type { ReactNode } from "react";

const fieldBase =
  "w-full rounded-lg border bg-surface px-3 text-sm text-ink transition-colors duration-150 placeholder:text-subtle focus:outline-none focus:ring-3";

function stateClass(hasError: boolean) {
  return hasError
    ? "border-danger focus:border-danger focus:ring-danger/15"
    : "border-line hover:border-subtle/60 focus:border-accent focus:ring-accent/15";
}

export function inputClass(hasError: boolean) {
  return `h-11 ${fieldBase} ${stateClass(hasError)}`;
}

export function textareaClass(hasError: boolean) {
  return `min-h-24 py-2.5 ${fieldBase} ${stateClass(hasError)}`;
}

export function messageId(id: string, error?: string, hint?: string) {
  return error || hint ? `${id}-message` : undefined;
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-message`} className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-message`} className="text-xs text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
