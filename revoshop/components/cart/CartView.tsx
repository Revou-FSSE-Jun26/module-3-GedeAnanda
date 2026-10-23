"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ShoppingCartSimple, Trash } from "@phosphor-icons/react";
import Card from "../Card";
import QuantityCounter from "../QuantityCounter";
import { Skeleton } from "../Skeletons";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

export default function CartView() {
  const { items, itemCount, total, ready, setQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();
  const isEmpty = items.length === 0;

  if (!ready) {
    return (
      <div role="status" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <span className="sr-only">Loading your cart</span>
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  function handleRemove(productId: number, name: string) {
    removeItem(productId);
    toast.success(`${name} removed from cart`);
  }

  function handleClear() {
    clearCart();
    toast.success("Cart cleared");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <Card padded={false} className="overflow-hidden">
        {isEmpty ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
              <ShoppingCartSimple size={28} aria-hidden />
            </span>
            <h2 className="mt-4 font-semibold text-ink">Your cart is empty</h2>
            <p className="mt-1 max-w-[34ch] text-sm text-muted">Browse the catalog and add something you like.</p>
            <Link
              href="/products"
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <caption className="sr-only">Items in your cart</caption>
            <thead className="border-b border-line bg-sunken/60 text-left text-xs font-semibold text-subtle">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Product
                </th>
                <th scope="col" className="hidden px-4 py-3 text-right sm:table-cell">
                  Price
                </th>
                <th scope="col" className="px-2 py-3 text-center sm:px-4">
                  Quantity
                </th>
                <th scope="col" className="hidden px-4 py-3 text-right sm:table-cell">
                  Subtotal
                </th>
                <th scope="col" className="w-12 py-3 pr-2">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => {
                const subtotal = formatPrice(item.price * item.quantity);
                return (
                  <tr key={item.productId}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/products/${item.productId}`}
                          tabIndex={-1}
                          aria-hidden
                          className="relative hidden size-14 shrink-0 overflow-hidden rounded-md bg-sunken sm:block"
                        >
                          {item.imageUrl && (
                            <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                          )}
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.productId}`}
                            className="line-clamp-2 font-medium text-ink hover:text-accent"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-0.5 font-semibold text-ink tabular-nums sm:hidden">{subtotal}</p>
                          <p className="text-xs text-subtle tabular-nums sm:hidden">{formatPrice(item.price)} each</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-right text-muted tabular-nums sm:table-cell">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-2 py-3 sm:px-4">
                      <div className="flex justify-center">
                        <QuantityCounter
                          size="sm"
                          value={item.quantity}
                          max={item.stock}
                          onChange={(quantity) => setQuantity(item.productId, quantity)}
                          label={`Quantity of ${item.name}`}
                        />
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-right font-semibold text-ink tabular-nums sm:table-cell">
                      {subtotal}
                    </td>
                    <td className="py-3 pr-2">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId, item.name)}
                        aria-label={`Remove ${item.name}`}
                        className="grid size-10 place-items-center rounded-lg text-subtle transition-colors duration-150 hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash size={18} aria-hidden />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <Card as="aside" aria-labelledby="summary-heading" className="lg:sticky lg:top-32">
        <h2 id="summary-heading" className="font-bold text-ink">
          Order summary
        </h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div className="flex justify-between text-muted">
            <dt>Items</dt>
            <dd className="tabular-nums">{itemCount}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-3">
            <dt className="font-semibold text-ink">Total</dt>
            <dd data-testid="cart-total" className="text-lg font-bold text-ink tabular-nums">
              {formatPrice(total)}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => router.push("/checkout")}
          disabled={isEmpty}
          className="mt-4 h-11 w-full rounded-lg bg-accent text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-sunken disabled:text-subtle"
        >
          Proceed to checkout
        </button>
        {isEmpty ? (
          <p className="mt-2 text-center text-xs text-subtle">Add an item to check out.</p>
        ) : (
          <button
            type="button"
            onClick={handleClear}
            className="mt-2 h-10 w-full rounded-lg text-sm font-semibold text-muted transition-colors duration-150 hover:bg-danger-soft hover:text-danger"
          >
            Clear cart
          </button>
        )}
      </Card>
    </div>
  );
}
