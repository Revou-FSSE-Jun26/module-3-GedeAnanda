import type { Metadata } from "next";
import Container from "@/components/Container";
import AuthGuard from "@/components/auth/AuthGuard";
import OrderList from "@/components/orders/OrderList";

export const metadata: Metadata = {
  title: "My orders",
  description: "Your RevoShop order history.",
};

export default function OrdersPage() {
  return (
    <Container narrow className="py-4 sm:py-6">
      <h1 className="text-xl font-bold text-ink sm:text-2xl">My orders</h1>
      <div className="mt-3">
        <AuthGuard>
          <OrderList />
        </AuthGuard>
      </div>
    </Container>
  );
}
