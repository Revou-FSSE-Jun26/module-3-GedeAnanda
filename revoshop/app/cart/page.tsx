import type { Metadata } from "next";
import Container from "@/components/Container";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the items in your RevoShop cart.",
};

export default function CartPage() {
  return (
    <Container className="py-4 sm:py-6">
      <h1 className="text-xl font-bold text-ink sm:text-2xl">Shopping cart</h1>
      <div className="mt-4">
        <CartView />
      </div>
    </Container>
  );
}
