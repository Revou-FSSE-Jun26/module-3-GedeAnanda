"use client";

import { useState } from "react";
import QuantityCounter from "./QuantityCounter";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

interface AddToCartPanelProps {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive?: boolean;
}

export default function AddToCartPanel({
  id,
  name,
  price,
  stock,
  imageUrl,
  isActive = true,
}: AddToCartPanelProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const inStock = isActive && stock > 0;

  function handleAddToCart() {
    addItem({ productId: id, name, price, quantity, stock, imageUrl });
    setQuantity(1);
  }

  const addButton = (className: string) =>
    inStock ? (
      <button
        type="button"
        onClick={handleAddToCart}
        className={`rounded-lg bg-accent text-sm font-semibold text-on-accent transition-[background-color,transform] duration-150 hover:bg-accent-hover active:scale-[0.98] ${className}`}
      >
        Add to cart
      </button>
    ) : (
      <button
        type="button"
        disabled
        className={`cursor-not-allowed rounded-lg bg-sunken text-sm font-semibold text-subtle ${className}`}
      >
        {isActive ? "Out of stock" : "Unavailable"}
      </button>
    );

  return (
    <>
      <div className="hidden space-y-4 rounded-lg p-4 ring-1 ring-line md:block">
        <p className="text-sm font-bold text-ink">Set quantity</p>
        {inStock && (
          <div className="flex items-center gap-3">
            <QuantityCounter value={quantity} onChange={setQuantity} max={stock} />
            <span className="text-sm text-subtle">Stock {stock}</span>
          </div>
        )}
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted">Subtotal</span>
          <span className="text-lg font-bold text-ink tabular-nums">{formatPrice(price * quantity)}</span>
        </div>
        {addButton("h-11 w-full")}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-bar md:hidden">
        <div className="flex items-center gap-3">
          {inStock && <QuantityCounter value={quantity} onChange={setQuantity} max={stock} />}
          {addButton("h-10 flex-1")}
        </div>
      </div>
    </>
  );
}
