import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { getOrders } from "@/lib/api";
import { formatDate, formatPrice, pluralize } from "@/lib/format";
import { getProductImage } from "@/lib/images";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Order history",
  description: "Your RevoShop order history.",
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-warning-soft text-on-warning-soft",
  paid: "bg-accent-soft text-on-accent-soft",
  shipped: "bg-accent-soft text-on-accent-soft",
  completed: "bg-success-soft text-success",
  cancelled: "bg-danger-soft text-danger",
};

function parseStatus(value: string | string[] | undefined): OrderStatus | undefined {
  return ORDER_STATUSES.find((status) => status === value);
}

export default async function OrdersPage({ searchParams }: PageProps<"/orders">) {
  // Request-time only
  await connection();
  const status = parseStatus((await searchParams).status);
  const orders = await getOrders(status);

  const tabs = [{ value: undefined, label: "All" }, ...ORDER_STATUSES.map((value) => ({ value, label: value }))];

  return (
    <Container narrow className="py-4 sm:py-6">
      <h1 className="text-xl font-bold text-ink sm:text-2xl">Order history</h1>

      {orders === null ? (
        <Card className="mt-4">
          <h2 className="font-bold text-ink">Connect an API account</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Orders are private on the RevoShop API, so this page signs in on the server. Add{" "}
            <code className="rounded bg-sunken px-1 py-0.5 font-mono text-xs text-ink">API_AUTH_EMAIL</code> and{" "}
            <code className="rounded bg-sunken px-1 py-0.5 font-mono text-xs text-ink">API_AUTH_PASSWORD</code> to{" "}
            <code className="rounded bg-sunken px-1 py-0.5 font-mono text-xs text-ink">.env.local</code>, then restart the
            dev server.
          </p>
        </Card>
      ) : (
        <>
          <nav aria-label="Filter by status" className="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="flex gap-2">
              {tabs.map((tab) => {
                const active = tab.value === status;
                return (
                  <li key={tab.label} className="shrink-0">
                    <Link
                      href={tab.value ? `/orders?status=${tab.value}` : "/orders"}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex h-9 items-center rounded-lg border px-3.5 text-sm capitalize transition-colors duration-150 ${
                        active
                          ? "border-accent bg-accent-soft font-semibold text-on-accent-soft"
                          : "border-line bg-surface text-muted hover:border-accent/50 hover:text-ink"
                      }`}
                    >
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {orders.length === 0 ? (
            <Card className="mt-4 py-14 text-center">
              <h2 className="font-semibold text-ink">{status ? `No ${status} orders` : "No orders yet"}</h2>
              <p className="mt-1 text-sm text-muted">Orders placed with this account will show up here.</p>
              <Link
                href="/products"
                className="mt-5 inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
              >
                Start shopping
              </Link>
            </Card>
          ) : (
            <>
              <p className="mt-3 text-sm text-muted">{pluralize(orders.length, "order")}</p>
              <ul className="mt-2 space-y-3">
                {orders.map((order) => (
                  <li key={order.id}>
                    <Card as="article" padded={false} aria-labelledby={`order-${order.id}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                          <h2 id={`order-${order.id}`} className="font-bold text-ink">
                            Order #{order.id}
                          </h2>
                          <span className="text-subtle">{formatDate(order.created_at)}</span>
                        </div>
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-semibold capitalize ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <ul className="divide-y divide-line px-4">
                        {order.items?.map((item) => {
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
                              <span className="shrink-0 font-semibold text-ink tabular-nums">
                                {formatPrice(item.subtotal)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
                        <span className="text-muted">Order total</span>
                        <span className="text-base font-bold text-ink tabular-nums">
                          {formatPrice(order.total_amount)}
                        </span>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </Container>
  );
}
