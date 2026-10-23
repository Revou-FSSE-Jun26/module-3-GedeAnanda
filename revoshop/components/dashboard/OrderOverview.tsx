"use client";

import Card from "../Card";
import FetchError from "../FetchError";
import OrderStatusBadge from "../orders/OrderStatusBadge";
import { Skeleton } from "../Skeletons";
import { tableHeadClass } from "./styles";
import { useFetch } from "@/hooks/useFetch";
import { getOrders, getUsers } from "@/lib/client-api";
import { formatDate, formatPrice, pluralize } from "@/lib/format";

async function loadOverview() {
  const [orders, users] = await Promise.all([getOrders(), getUsers()]);
  return { orders, users: new Map(users.map((user) => [user.id, user])) };
}

export default function OrderOverview() {
  const { data, error, loading, reload } = useFetch("admin-orders", loadOverview);

  if (loading) {
    return (
      <div role="status" className="space-y-3">
        <span className="sr-only">Loading orders</span>
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-72 rounded-lg" />
      </div>
    );
  }

  if (!data) return <FetchError title="We couldn't load orders" message={error ?? ""} onRetry={reload} />;

  const { orders, users } = data;
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-ink sm:text-2xl">Orders</h1>
        <p className="mt-0.5 text-sm text-muted">
          {pluralize(orders.length, "order")} from all customers, {formatPrice(revenue)} excluding cancelled.
        </p>
      </div>

      <Card padded={false} className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <caption className="sr-only">All orders, read only</caption>
          <thead className={tableHeadClass}>
            <tr>
              <th scope="col" className="px-4 py-3">
                Order
              </th>
              <th scope="col" className="px-4 py-3">
                Customer
              </th>
              <th scope="col" className="px-4 py-3">
                Date
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((order) => {
              const customer = users.get(order.user_id);
              return (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-semibold text-ink">#{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{customer?.username ?? `User #${order.user_id}`}</p>
                    {customer && <p className="text-xs text-subtle">{customer.email}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-ink tabular-nums">
                    {formatPrice(order.total_amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && <p className="px-4 py-12 text-center text-sm text-muted">No orders yet.</p>}
      </Card>
    </div>
  );
}
