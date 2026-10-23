import Card from "../Card";
import { LoadingLabel, Skeleton } from "../Skeletons";

export function OrderListSkeleton() {
  return (
    <div role="status" className="space-y-3">
      <LoadingLabel>Loading orders</LoadingLabel>
      <div className="flex gap-2">
        {[12, 20, 14, 18, 24].map((width) => (
          <Skeleton key={width} className="h-9 shrink-0 rounded-lg" style={{ width: `${width * 4}px` }} />
        ))}
      </div>
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index} className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-5 w-24" />
        </Card>
      ))}
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div role="status" className="space-y-4">
      <LoadingLabel>Loading order</LoadingLabel>
      <Skeleton className="h-7 w-44" />
      <Card className="space-y-4">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-14 shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </Card>
    </div>
  );
}
