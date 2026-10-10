import Card from "@/components/Card";
import Container from "@/components/Container";
import { LoadingLabel, Skeleton } from "@/components/Skeletons";

export default function OrdersLoading() {
  return (
    <Container narrow className="py-8 sm:py-10">
      <div role="status">
        <LoadingLabel>Loading orders</LoadingLabel>
        <Skeleton className="h-9 w-56" />
        <Skeleton className="mt-3 h-4 w-72" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <Card key={index}>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="h-7 w-40" />
              </div>
              <div className="mt-5 h-20 rounded-xl bg-sunken motion-safe:animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
