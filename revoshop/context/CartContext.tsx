"use client";

import { createContext, useMemo, useSyncExternalStore } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { createLocalStore } from "@/lib/local-store";
import type { CartItem } from "@/lib/types";

type CartAction =
  | { type: "add"; item: CartItem }
  | { type: "setQuantity"; productId: number; quantity: number }
  | { type: "remove"; productId: number }
  | { type: "clear" };

// Immutable updates
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
    case "setQuantity":
      return state.map((item) =>
        item.productId === action.productId
          ? { ...item, quantity: Math.max(1, Math.min(action.quantity, item.stock)) }
          : item,
      );
    case "remove":
      return state.filter((item) => item.productId !== action.productId);
    case "clear":
      return [];
  }
}

const cartStore = createLocalStore<CartItem[]>("revoshop.cart", [], Array.isArray);

function dispatch(action: CartAction) {
  cartStore.set(cartReducer(cartStore.get(), action));
}

const actions = {
  addItem: (item: CartItem) => dispatch({ type: "add", item }),
  setQuantity: (productId: number, quantity: number) => dispatch({ type: "setQuantity", productId, quantity }),
  removeItem: (productId: number) => dispatch({ type: "remove", productId }),
  clearCart: () => dispatch({ type: "clear" }),
};

export interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  ready: boolean;
  addItem: (item: CartItem) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.getServerSnapshot);
  const ready = useHydrated();

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      ready,
      ...actions,
    }),
    [items, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
