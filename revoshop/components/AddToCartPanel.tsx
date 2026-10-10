"use client";

import { useState } from "react";
import { Check, ShoppingCartSimple } from "@phosphor-icons/react";
import QuantityCounter from "./QuantityCounter";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";

interface AddToCartPanelProps {
  id: number;
  name: string;
  price: number;
  stock: number;
  isActive?: boolean;
}

export default function AddToCartPanel({ id, name, price, stock, isActive = true }: AddToCartPanelProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inStock = isActive && stock > 0;

  function handleAddToCart() {
    addItem({ productId: id, name, price, quantity, stock });
    setQuantity(1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  if (!inStock) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled
          className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full border border-dashed border-line bg-sunken text-sm font-medium text-subtle"
        >
          {isActive ? "Out of stock" : "Unavailable"}
        </button>
        <p className="text-sm text-muted">This product cannot be added to your cart right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <QuantityCounter value={quantity} onChange={setQuantity} max={stock} />
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition-[background-color,transform] duration-200 hover:bg-accent-hover active:scale-[0.98]"
        >
          {justAdded ? (
            <>
              <Check size={18} weight="bold" aria-hidden /> Added to cart
            </>
          ) : (
            <>
              <ShoppingCartSimple size={18} weight="bold" aria-hidden /> Add to cart
            </>
          )}
        </button>
      </div>
      <p className="text-sm text-muted">
        Subtotal <span className="font-medium text-ink tabular-nums">{formatPrice(price * quantity)}</span>
      </p>
    </div>
  );
}
