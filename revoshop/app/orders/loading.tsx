import Card from "@/components/Card";
import Container from "@/components/Container";
import { LoadingLabel, Skeleton } from "@/components/Skeletons";

export default function OrdersLoading() {
  return (
    <Container narrow className="py-4 sm:py-6">
      <div role="status">
        <LoadingLabel>Loading orders</LoadingLabel>
        <Skeleton className="h-7 w-44" />
        <div className="mt-3 flex gap-2">
          {[12, 20, 14, 18, 24].map((width) => (
            <Skeleton key={width} className="h-9 shrink-0 rounded-lg" style={{ width: `${width * 4}px` }} />
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Card key={index} className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <div className="flex items-center gap-3">
                <Skeleton className="size-14 shrink-0" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <Skeleton className="h-5 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
