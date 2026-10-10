import { LoadingLabel, ProductCardSkeleton, Skeleton } from "@/components/Skeletons";

export default function ProductsLoading() {
  return (
    <div role="status" className="space-y-4">
      <LoadingLabel>Loading products</LoadingLabel>
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="flex gap-2 lg:hidden">
        {[12, 24, 20, 16].map((width) => (
          <Skeleton key={width} className="h-9 shrink-0 rounded-lg" style={{ width: `${width * 4}px` }} />
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
