import Container from "@/components/Container";
import { LoadingLabel, ProductCardSkeleton, Skeleton } from "@/components/Skeletons";

export default function HomeLoading() {
  return (
    <div role="status">
      <LoadingLabel>Loading the home page</LoadingLabel>
      <Container className="grid items-center gap-10 pt-8 pb-16 md:grid-cols-[1.1fr_1fr] md:pt-14 lg:gap-16">
        <div className="space-y-4">
          <Skeleton className="h-12 w-11/12 sm:h-14" />
          <Skeleton className="h-12 w-2/3 sm:h-14" />
          <Skeleton className="mt-6 h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
          <div className="flex gap-3 pt-6">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-44" />
          </div>
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-sunken motion-safe:animate-pulse md:aspect-[5/6] lg:aspect-[6/5]" />
      </Container>
      <Container className="pb-20">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-3 h-4 w-72" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </Container>
    </div>
  );
}
