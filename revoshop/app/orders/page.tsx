import type { Metadata } from "next";
import { connection } from "next/server";
import { Key, Receipt } from "@phosphor-icons/react/ssr";
import Card from "@/components/Card";
import Container from "@/components/Container";
import StatusBadge from "@/components/StatusBadge";
import { getOrders } from "@/lib/api";
import { formatDate, formatPrice, pluralize } from "@/lib/format";

export const metadata: Metadata = {
  title: "Orders",
  description: "Your RevoShop order history.",
};

export default async function OrdersPage() {
  // Credentials are read at request time, so never prerender this page at build.
  await connection();
  const orders = await getOrders();

  return (
    <Container narrow className="py-8 sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Order history</h1>

      {orders === null ? (
        <Card className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-on-accent-soft">
            <Key size={20} aria-hidden />
          </span>
          <div>
            <h2 className="font-semibold text-ink">Connect an API account</h2>
            <p className="mt-1 max-w-[60ch] text-sm leading-relaxed text-muted">
              Orders are private on the RevoShop API, so this page signs in on the server. Add{" "}
              <code className="rounded-md bg-sunken px-1.5 py-0.5 font-mono text-xs text-ink">API_AUTH_EMAIL</code>{" "}
              and{" "}
              <code className="rounded-md bg-sunken px-1.5 py-0.5 font-mono text-xs text-ink">API_AUTH_PASSWORD</code>{" "}
              to <code className="rounded-md bg-sunken px-1.5 py-0.5 font-mono text-xs text-ink">.env.local</code>,
              then restart the dev server.
            </p>
          </div>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="mt-8 flex flex-col items-center py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-sunken text-subtle">
            <Receipt size={22} aria-hidden />
          </span>
          <h2 className="mt-4 font-medium text-ink">No orders yet</h2>
          <p className="mt-1 text-sm text-muted">Orders placed with this account will show up here.</p>
        </Card>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            {pluralize(orders.length, "order")},{" "}
            {formatPrice(
              orders
                .filter((order) => order.status !== "cancelled")
                .reduce((sum, order) => sum + order.total_amount, 0),
            )}{" "}
            spent excluding cancelled orders.
          </p>

          <ul className="mt-8 space-y-4">
            {orders.map((order) => (
              <li key={order.id}>
                <Card as="article" aria-labelledby={`order-${order.id}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 id={`order-${order.id}`} className="font-semibold text-ink">
                        Order #{order.id}
                      </h2>
                      <p className="mt-0.5 text-sm text-subtle">Placed {formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={order.status} />
                      <p className="font-semibold tabular-nums text-ink">{formatPrice(order.total_amount)}</p>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <ul className="mt-5 space-y-2 rounded-xl bg-sunken/60 p-4">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex items-baseline justify-between gap-4 text-sm">
                          <span className="min-w-0 truncate text-ink">
                            {item.product?.name ?? `Product #${item.product_id}`}
                            <span className="text-subtle"> &times; {item.quantity}</span>
                          </span>
                          <span className="shrink-0 text-muted tabular-nums">{formatPrice(item.subtotal)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </Container>
  );
}
