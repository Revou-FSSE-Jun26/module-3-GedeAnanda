import { LoadingLabel, ProductCardSkeleton, Skeleton } from "@/components/Skeletons";

export default function ProductsLoading() {
  return (
    <div role="status" className="space-y-6">
      <LoadingLabel>Loading products</LoadingLabel>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-11 w-full" />
        <div className="flex gap-2">
          {[16, 28, 24, 20, 22].map((width) => (
            <Skeleton key={width} className="h-9 shrink-0" style={{ width: `${width * 4}px` }} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
