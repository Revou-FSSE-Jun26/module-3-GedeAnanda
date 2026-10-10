"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import type { CartItem } from "@/lib/types";

type CartAction =
  | { type: "add"; item: CartItem }
  | { type: "remove"; productId: number }
  | { type: "clear" };

// Every branch returns a new array or new objects; the previous state is never mutated.
function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const exists = state.some((item) => item.productId === action.item.productId);
      if (!exists) return [...state, action.item];

      return state.map((item) =>
        item.productId === action.item.productId
          ? { ...item, quantity: Math.min(item.quantity + action.item.quantity, item.stock) }
          : item,
      );
    }
    case "remove":
      return state.filter((item) => item.productId !== action.productId);
    case "clear":
      return [];
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem: (item) => dispatch({ type: "add", item }),
      removeItem: (productId) => dispatch({ type: "remove", productId }),
      clearCart: () => dispatch({ type: "clear" }),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
