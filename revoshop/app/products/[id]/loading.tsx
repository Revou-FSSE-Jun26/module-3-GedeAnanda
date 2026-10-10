import { LoadingLabel, Skeleton } from "@/components/Skeletons";

export default function ProductDetailLoading() {
  return (
    <div role="status">
      <LoadingLabel>Loading product</LoadingLabel>
      <Skeleton className="h-5 w-28" />
      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-10">
        <div className="aspect-square rounded-2xl bg-sunken motion-safe:animate-pulse" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="h-20 rounded-2xl bg-sunken motion-safe:animate-pulse" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
