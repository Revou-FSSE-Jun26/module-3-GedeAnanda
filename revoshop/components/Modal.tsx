"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
}

// Mount to open
export default function Modal({ labelledBy, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    // Hidden page
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onClose={() => {
        // Ignore stale events
        if (!dialogRef.current?.open) onClose();
      }}
      onClick={(event) => {
        // Backdrop click
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-lg bg-surface p-0 text-ink shadow-lift"
    >
      {children}
    </dialog>
  );
}
