import type { Metadata } from "next";
import Container from "@/components/Container";
import AuthGuard from "@/components/auth/AuthGuard";
import CheckoutView from "@/components/cart/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirm your RevoShop order.",
};

export default function CheckoutPage() {
  return (
    <Container className="py-4 sm:py-6">
      <h1 className="text-xl font-bold text-ink sm:text-2xl">Checkout</h1>
      <div className="mt-4">
        <AuthGuard>
          <CheckoutView />
        </AuthGuard>
      </div>
    </Container>
  );
}
