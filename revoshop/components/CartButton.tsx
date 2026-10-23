"use client";

import Link from "next/link";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import { useCart } from "@/hooks/useCart";

export default function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      className="relative grid size-10 shrink-0 place-items-center rounded-lg text-ink transition-colors duration-150 hover:bg-sunken"
    >
      <ShoppingCartSimple size={24} aria-hidden />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] font-bold text-white tabular-nums">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
