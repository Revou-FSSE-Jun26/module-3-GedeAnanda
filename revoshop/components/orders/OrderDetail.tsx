"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import Card from "../Card";
import FetchError from "../FetchError";
import OrderStatusBadge from "./OrderStatusBadge";
import { OrderDetailSkeleton } from "./OrderSkeletons";
import { useFetch } from "@/hooks/useFetch";
import { getOrder } from "@/lib/client-api";
import { formatDate, formatPrice, pluralize } from "@/lib/format";
import { getProductImage } from "@/lib/images";

const backLink = (
  <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
    <ArrowLeft size={16} aria-hidden />
    My orders
  </Link>
);

export default function OrderDetail({ id }: { id: number }) {
  const { data: order, error, loading, reload } = useFetch(`order-${id}`, () => getOrder(id));

  if (loading) return <OrderDetailSkeleton />;

  if (order === null) {
    return (
      <div className="space-y-4">
        {backLink}
        <Card className="py-14 text-center">
          <h1 className="font-semibold text-ink">Order not found</h1>
          <p className="mt-1 text-sm text-muted">It may belong to another account, or the link is wrong.</p>
        </Card>
      </div>
    );
  }

  if (!order) {
    return <FetchError title="We couldn't load this order" message={error ?? ""} onRetry={reload} />;
  }

  const items = order.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      {backLink}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">Order #{order.id}</h1>
          <p className="mt-0.5 text-sm text-subtle">Placed on {formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <Card as="section" padded={false} aria-labelledby="items-heading">
        <h2 id="items-heading" className="border-b border-line px-4 py-3 text-sm font-bold text-ink">
          Items <span className="font-normal text-subtle">({pluralize(itemCount, "item")})</span>
        </h2>
        <ul className="divide-y divide-line px-4">
          {items.map((item) => {
            const name = item.product?.name ?? `Product #${item.product_id}`;
            const imageUrl = item.product ? getProductImage(item.product) : undefined;
            return (
              <li key={item.id} className="flex items-center gap-3 py-3 text-sm">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-sunken">
                  {imageUrl && <Image src={imageUrl} alt="" fill sizes="56px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                  {item.product ? (
                    <Link href={`/products/${item.product_id}`} className="block truncate text-ink hover:text-accent">
                      {name}
                    </Link>
                  ) : (
                    <span className="block truncate text-ink">{name}</span>
                  )}
                  <span className="text-subtle tabular-nums">
                    {item.quantity} &times; {formatPrice(item.price)}
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-ink tabular-nums">{formatPrice(item.subtotal)}</span>
              </li>
            );
          })}
        </ul>
        <div className="flex items-baseline justify-between border-t border-line px-4 py-3">
          <span className="text-sm font-semibold text-ink">Order total</span>
          <span className="text-lg font-bold text-ink tabular-nums">{formatPrice(order.total_amount)}</span>
        </div>
      </Card>
    </div>
  );
}
