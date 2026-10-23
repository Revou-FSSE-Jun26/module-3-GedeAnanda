import Container from "@/components/Container";
import { OrderDetailSkeleton } from "@/components/orders/OrderSkeletons";

export default function OrderDetailLoading() {
  return (
    <Container narrow className="py-4 sm:py-6">
      <OrderDetailSkeleton />
    </Container>
  );
}
