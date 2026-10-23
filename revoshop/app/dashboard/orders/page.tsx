import type { Metadata } from "next";
import OrderOverview from "@/components/dashboard/OrderOverview";

// Behind client guard
export const instant = false;

export const metadata: Metadata = { title: "Orders" };

export default function DashboardOrdersPage() {
  return <OrderOverview />;
}
