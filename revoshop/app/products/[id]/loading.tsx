import Card from "@/components/Card";
import { LoadingLabel, Skeleton } from "@/components/Skeletons";

export default function ProductDetailLoading() {
  return (
    <div role="status" className="space-y-6">
      <LoadingLabel>Loading product</LoadingLabel>
      <Skeleton className="h-4 w-64" />
      <Card className="grid gap-6 md:grid-cols-2 lg:gap-8">
        <div className="aspect-square rounded-lg bg-line/60 motion-safe:animate-pulse" />
        <div className="space-y-4">
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </Card>
    </div>
  );
}
