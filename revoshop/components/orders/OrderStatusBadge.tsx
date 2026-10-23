import type { OrderStatus } from "@/lib/types";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-warning-soft text-on-warning-soft",
  paid: "bg-accent-soft text-on-accent-soft",
  shipped: "bg-accent-soft text-on-accent-soft",
  completed: "bg-success-soft text-success",
  cancelled: "bg-danger-soft text-danger",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold capitalize ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
