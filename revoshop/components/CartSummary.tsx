"use client";

import { ShoppingCartSimple, Trash } from "@phosphor-icons/react";
import Card from "./Card";
import { useCart } from "./CartProvider";
import { formatPrice, pluralize } from "@/lib/format";

export default function CartSummary() {
  const { items, itemCount, total, removeItem, clearCart } = useCart();

  return (
    <Card as="section" id="cart" aria-labelledby="cart-heading" className="scroll-mt-28 lg:sticky lg:top-24">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="cart-heading" className="text-lg font-semibold tracking-tight">
          Your cart
        </h2>
        <p className="text-sm text-subtle tabular-nums" aria-live="polite">
          {pluralize(itemCount, "item")}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-line px-4 py-8 text-center">
          <ShoppingCartSimple size={28} className="text-subtle" aria-hidden />
          <p className="mt-3 text-sm font-medium text-ink">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted">Pick a product and it will show up here.</p>
        </div>
      ) : (
        <>
          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-subtle tabular-nums">
                    {item.quantity} &times; {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Remove ${item.name} from cart`}
                  className="-mt-1 grid size-8 shrink-0 place-items-center rounded-full text-subtle transition-colors duration-200 hover:bg-danger-soft hover:text-danger"
                >
                  <Trash size={16} aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-line pt-4">
            <div className="flex justify-between text-sm text-muted">
              <dt>Items</dt>
              <dd className="tabular-nums">{itemCount}</dd>
            </div>
            <div className="flex justify-between font-semibold text-ink">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={clearCart}
            className="mt-5 h-10 w-full rounded-full border border-line text-sm font-medium text-muted transition-colors duration-200 hover:bg-sunken hover:text-ink"
          >
            Clear cart
          </button>
        </>
      )}
    </Card>
  );
}
