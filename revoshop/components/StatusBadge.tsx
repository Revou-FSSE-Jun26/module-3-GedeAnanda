import type { OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, string> = {
  pending: "bg-sunken text-muted",
  paid: "bg-accent-soft text-on-accent-soft",
  shipped: "bg-accent-soft text-on-accent-soft",
  completed: "bg-accent text-on-accent",
  cancelled: "bg-danger-soft text-danger",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
