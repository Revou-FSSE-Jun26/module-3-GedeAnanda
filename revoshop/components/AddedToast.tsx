"use client";

import Image from "next/image";
import { useEffect } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { useCart } from "@/hooks/useCart";

const VISIBLE_MS = 3500;

export default function AddedToast() {
  const { lastAdded, openCart, dismissLastAdded } = useCart();

  useEffect(() => {
    if (!lastAdded) return;
    const timer = setTimeout(dismissLastAdded, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [lastAdded, dismissLastAdded]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 bottom-20 z-50 flex justify-center md:inset-x-auto md:right-6 md:bottom-6"
    >
      {lastAdded && (
        <div className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg bg-ink p-3 text-white shadow-lift">
          <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-white/10">
            {lastAdded.imageUrl && (
              <Image src={lastAdded.imageUrl} alt="" fill sizes="44px" className="object-cover" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <CheckCircle size={16} weight="fill" className="text-[#4ade80]" aria-hidden />
              Added to cart
            </p>
            <p className="truncate text-xs text-white/70">
              {lastAdded.name} &times; {lastAdded.quantity}
            </p>
          </div>
          <button
            type="button"
            onClick={openCart}
            className="shrink-0 rounded-md px-2 py-1.5 text-sm font-semibold text-[#9db7ff] transition-colors duration-150 hover:bg-white/10"
          >
            View cart
          </button>
        </div>
      )}
    </div>
  );
}
