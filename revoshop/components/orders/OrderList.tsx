"use client";

import Link from "next/link";
import { useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import Card from "../Card";
import FetchError from "../FetchError";
import OrderStatusBadge from "./OrderStatusBadge";
import { OrderListSkeleton } from "./OrderSkeletons";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { getOrders } from "@/lib/client-api";
import { formatDate, formatPrice, pluralize } from "@/lib/format";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

const tabs: { value: OrderStatus | null; label: string }[] = [
  { value: null, label: "All" },
  ...ORDER_STATUSES.map((value) => ({ value, label: value })),
];

export default function OrderList() {
  const { user } = useAuth();
  const { data, error, loading, reload } = useFetch("my-orders", getOrders);
  const [status, setStatus] = useState<OrderStatus | null>(null);

  if (loading) return <OrderListSkeleton />;
  if (!data) {
    return <FetchError title="We couldn't load your orders" message={error ?? ""} onRetry={reload} />;
  }

  // Own orders only
  const mine = data.filter((order) => order.user_id === user?.id);
  const visible = status ? mine.filter((order) => order.status === status) : mine;

  return (
    <div>
      <div role="group" aria-label="Filter by status" className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => {
          const active = tab.value === status;
          return (
            <button
              key={tab.label}
              type="button"
              aria-pressed={active}
              onClick={() => setStatus(tab.value)}
              className={`h-9 shrink-0 rounded-lg border px-3.5 text-sm capitalize transition-colors duration-150 ${
                active
                  ? "border-accent bg-accent-soft font-semibold text-on-accent-soft"
                  : "border-line bg-surface text-muted hover:border-accent/50 hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <Card className="mt-4 py-14 text-center">
          <h2 className="font-semibold text-ink">{status ? `No ${status} orders` : "No orders yet"}</h2>
          <p className="mt-1 text-sm text-muted">Orders you place will show up here.</p>
          <Link
            href="/products"
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
          >
            Start shopping
          </Link>
        </Card>
      ) : (
        <>
          <p className="mt-3 text-sm text-muted">{pluralize(visible.length, "order")}</p>
          <ul className="mt-2 space-y-2">
            {visible.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="group flex items-center gap-4 rounded-lg bg-surface p-4 shadow-card ring-1 ring-line/70 transition-shadow duration-200 hover:shadow-lift"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-ink">Order #{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-0.5 text-sm text-subtle">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-subtle">Total</p>
                    <p className="font-bold text-ink tabular-nums">{formatPrice(order.total_amount)}</p>
                  </div>
                  <CaretRight size={16} className="shrink-0 text-subtle group-hover:text-accent" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
