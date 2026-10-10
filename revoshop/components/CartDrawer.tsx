"use client";

import { useEffect, useRef } from "react";
import CartSummary from "./CartSummary";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { isOpen, closeCart } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cart-heading"
      onClose={closeCart}
      onClick={(event) => {
        // Backdrop click
        if (event.target === event.currentTarget) closeCart();
      }}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-md bg-surface p-0 text-ink shadow-lift sm:max-w-sm"
    >
      <CartSummary onClose={closeCart} />
    </dialog>
  );
}
