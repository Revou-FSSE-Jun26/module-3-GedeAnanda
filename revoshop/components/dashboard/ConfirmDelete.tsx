"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import FormAlert from "../FormAlert";
import Spinner from "../Spinner";
import { ApiError, errorMessage } from "@/lib/http";

interface ConfirmDeleteProps {
  title: string;
  message: string;
  conflictHint: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDelete({ title, message, conflictHint, onConfirm, onCancel }: ConfirmDeleteProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<{ message: string; conflict: boolean } | null>(null);

  async function handleConfirm() {
    setPending(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      const text = errorMessage(err);
      // Guard hit
      setError({ message: text, conflict: err instanceof ApiError && err.status === 409 });
      toast.error(text);
      setPending(false);
    }
  }

  return (
    <div className="p-5">
      <h2 id="confirm-delete-heading" className="text-base font-bold text-ink">
        {title}
      </h2>
      <p className="mt-1 text-sm text-muted">{message}</p>

      {error && (
        <div className="mt-4 space-y-2">
          <FormAlert>{error.message}</FormAlert>
          {error.conflict && <p className="text-sm text-muted">{conflictHint}</p>}
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-line px-4 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-sunken hover:text-ink"
        >
          {error?.conflict ? "Close" : "Cancel"}
        </button>
        {!error?.conflict && (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-danger px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-danger/90 disabled:cursor-wait disabled:opacity-80"
          >
            {pending && <Spinner />}
            {pending ? "Deleting" : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}
