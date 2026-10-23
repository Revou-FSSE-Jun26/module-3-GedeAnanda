"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

  // Track open dialog
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDialog(document.querySelector<HTMLDialogElement>("dialog[open]"));
    });
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
    return () => observer.disconnect();
  }, []);

  const toaster = (
    <Toaster
      position="top-center"
      toastOptions={{
        style: { fontSize: "14px", color: "var(--color-ink)", boxShadow: "var(--shadow-lift)" },
        success: { iconTheme: { primary: "var(--color-success)", secondary: "#fff" } },
        error: { iconTheme: { primary: "var(--color-danger)", secondary: "#fff" } },
      }}
    />
  );

  // Above modal backdrop
  return dialog ? createPortal(toaster, dialog) : toaster;
}
