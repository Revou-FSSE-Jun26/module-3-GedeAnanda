"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash, X } from "@phosphor-icons/react";
import QuantityCounter from "./QuantityCounter";
import { useCart } from "./CartProvider";
import { formatPrice, pluralize } from "@/lib/format";

export default function CartSummary({ onClose }: { onClose: () => void }) {
  const { items, itemCount, total, setQuantity, removeItem, clearCart } = useCart();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4 sm:px-5">
        <h2 id="cart-heading" className="text-base font-bold text-ink">
          Cart <span className="font-normal text-subtle">({pluralize(itemCount, "item")})</span>
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cart"
          className="grid size-9 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-sunken hover:text-ink"
        >
          <X size={20} aria-hidden />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="font-semibold text-ink">Your cart is empty</p>
          <p className="mt-1 max-w-[30ch] text-sm text-muted">
            Browse the catalog and tap Add to put something here.
          </p>
          <Link
            href="/products"
            onClick={onClose}
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-4 sm:px-5">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 py-4">
                <Link
                  href={`/products/${item.productId}`}
                  onClick={onClose}
                  className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-sunken"
                >
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center text-[10px] text-subtle">No photo</span>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.productId}`}
                    onClick={onClose}
                    className="line-clamp-2 text-sm text-ink hover:text-accent"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-sm font-bold tabular-nums">{formatPrice(item.price)}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <QuantityCounter
                      size="sm"
                      value={item.quantity}
                      max={item.stock}
                      onChange={(quantity) => setQuantity(item.productId, quantity)}
                      label={`Quantity of ${item.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="grid size-8 place-items-center rounded-lg text-subtle transition-colors duration-150 hover:bg-danger-soft hover:text-danger"
                    >
                      <Trash size={18} aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="shrink-0 space-y-3 border-t border-line px-4 py-4 sm:px-5">
            <dl className="space-y-1">
              <div className="flex justify-between text-sm text-muted">
                <dt>Items</dt>
                <dd className="tabular-nums">{itemCount}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="text-lg font-bold text-ink tabular-nums">{formatPrice(total)}</dd>
              </div>
            </dl>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="h-11 rounded-lg border border-line px-4 text-sm font-semibold text-muted transition-colors duration-150 hover:border-danger hover:text-danger"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 flex-1 rounded-lg bg-accent text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
