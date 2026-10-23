"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import Card from "../Card";
import FormAlert from "../FormAlert";
import Spinner from "../Spinner";
import SubmitButton from "../SubmitButton";
import { Skeleton } from "../Skeletons";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/lib/client-api";
import { formatPrice, pluralize } from "@/lib/format";
import { errorMessage } from "@/lib/http";

export default function CheckoutView() {
  const { items, itemCount, total, ready, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset when hidden
  useLayoutEffect(
    () => () => {
      setPlaced(false);
      setPending(false);
      setError(null);
    },
    [],
  );

  if (!ready) return <Skeleton className="h-64 rounded-lg" />;

  if (placed) {
    return (
      <p role="status" className="flex items-center justify-center gap-2 py-24 text-sm text-muted">
        <Spinner className="text-accent" />
        Order confirmed. Opening your orders
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="py-14 text-center">
        <h2 className="font-semibold text-ink">Your cart is empty</h2>
        <p className="mt-1 text-sm text-muted">Add a product to your cart before checking out.</p>
        <Link
          href="/products"
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
        >
          Browse products
        </Link>
      </Card>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const order = await createOrder(items.map((item) => ({ product_id: item.productId, quantity: item.quantity })));
      setPlaced(true);
      clearCart();
      toast.success(`Order #${order.id} confirmed`);
      router.push("/orders");
    } catch (err) {
      const message = errorMessage(err);
      setError(message);
      toast.error(message);
      setPending(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div className="space-y-4">
        <Card as="section" aria-labelledby="buyer-heading">
          <h2 id="buyer-heading" className="text-sm font-bold text-ink">
            Ordering as
          </h2>
          <p className="mt-2 text-sm font-semibold text-ink">{user?.username}</p>
          <p className="text-sm text-muted">{user?.email}</p>
        </Card>

        <Card as="section" padded={false} aria-labelledby="review-heading">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 id="review-heading" className="text-sm font-bold text-ink">
              Items <span className="font-normal text-subtle">({pluralize(itemCount, "item")})</span>
            </h2>
            <Link href="/cart" className="text-sm font-semibold text-accent hover:underline">
              Edit cart
            </Link>
          </div>
          <ul className="divide-y divide-line px-4">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3 py-3 text-sm">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-sunken">
                  {item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-ink">{item.name}</span>
                  <span className="text-subtle tabular-nums">
                    {item.quantity} &times; {formatPrice(item.price)}
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-ink tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card as="aside" aria-labelledby="checkout-summary" className="lg:sticky lg:top-32">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 id="checkout-summary" className="font-bold text-ink">
            Order summary
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between text-muted">
              <dt>Items</dt>
              <dd className="tabular-nums">{itemCount}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="text-lg font-bold text-ink tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          {error && <FormAlert>{error}</FormAlert>}
          <SubmitButton pending={pending} pendingLabel="Confirming order">
            Confirm order
          </SubmitButton>
          <p className="text-center text-xs text-subtle">Stock is reserved as soon as you confirm.</p>
        </form>
      </Card>
    </div>
  );
}
