"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, useState } from "react";
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

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  lastAdded: CartItem | null;
  addItem: (item: CartItem) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  dismissLastAdded: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "add", item });
    setLastAdded(item);
  }, []);

  const dismissLastAdded = useCallback(() => setLastAdded(null), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      isOpen,
      lastAdded,
      addItem,
      setQuantity: (productId, quantity) => dispatch({ type: "setQuantity", productId, quantity }),
      removeItem: (productId) => dispatch({ type: "remove", productId }),
      clearCart: () => dispatch({ type: "clear" }),
      openCart: () => {
        setLastAdded(null);
        setIsOpen(true);
      },
      closeCart: () => setIsOpen(false),
      dismissLastAdded,
    }),
    [items, isOpen, lastAdded, addItem, dismissLastAdded],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
