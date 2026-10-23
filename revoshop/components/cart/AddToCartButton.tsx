"use client";

import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  productId: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive?: boolean;
  quantity?: number;
  onAdded?: () => void;
  ariaLabel?: string;
  className?: string;
  children?: ReactNode;
}

export default function AddToCartButton({
  productId,
  name,
  price,
  stock,
  imageUrl,
  isActive = true,
  quantity = 1,
  onAdded,
  ariaLabel,
  className = "",
  children = "Add to cart",
}: AddToCartButtonProps) {
  const { items, addItem } = useCart();
  const inCart = items.find((item) => item.productId === productId)?.quantity ?? 0;

  if (!isActive || stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className={`cursor-not-allowed rounded-lg bg-sunken text-sm font-semibold text-subtle ${className}`}
      >
        {isActive ? "Out of stock" : "Unavailable"}
      </button>
    );
  }

  function handleClick() {
    if (inCart + quantity > stock) {
      toast.error(`Only ${stock} in stock, and ${inCart} already in your cart.`);
      return;
    }
    addItem({ productId, name, price, quantity, stock, imageUrl });
    toast.success(`${name} × ${quantity} added to cart`);
    onAdded?.();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`rounded-lg bg-accent text-sm font-semibold whitespace-nowrap text-on-accent transition-[background-color,transform] duration-150 hover:bg-accent-hover active:scale-[0.97] ${className}`}
    >
      {children}
    </button>
  );
}
