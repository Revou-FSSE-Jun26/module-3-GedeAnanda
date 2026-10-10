"use client";

import Link from "next/link";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import { useCart } from "./CartProvider";

export default function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/products#cart"
      aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      className="relative inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors duration-200 hover:bg-sunken"
    >
      <ShoppingCartSimple size={18} weight="bold" aria-hidden />
      <span className="hidden sm:inline">Cart</span>
      <span
        className={`min-w-6 rounded-full px-1.5 text-center text-xs leading-6 tabular-nums ${
          itemCount > 0 ? "bg-accent text-on-accent" : "bg-sunken text-muted"
        }`}
      >
        {itemCount}
      </span>
    </Link>
  );
}
