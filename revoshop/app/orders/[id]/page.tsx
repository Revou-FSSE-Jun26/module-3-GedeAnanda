import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import AuthGuard from "@/components/auth/AuthGuard";
import OrderDetail from "@/components/orders/OrderDetail";

export const metadata: Metadata = { title: "Order details" };

export default async function OrderDetailPage({ params }: PageProps<"/orders/[id]">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  return (
    <Container narrow className="py-4 sm:py-6">
      <AuthGuard>
        <OrderDetail id={id} />
      </AuthGuard>
    </Container>
  );
}
