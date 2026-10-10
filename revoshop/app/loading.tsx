import Container from "@/components/Container";
import { LoadingLabel, ProductCardSkeleton, Skeleton } from "@/components/Skeletons";

export default function HomeLoading() {
  return (
    <div role="status" className="space-y-8 pb-12 sm:space-y-10">
      <LoadingLabel>Loading the home page</LoadingLabel>
      <Container className="pt-4 sm:pt-6">
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
          <Skeleton className="h-48 rounded-lg sm:h-64" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </div>
        </div>
      </Container>
      <Container>
        <Skeleton className="h-6 w-32" />
        <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-lg" />
          ))}
        </div>
      </Container>
      <Container>
        <Skeleton className="h-6 w-48" />
        <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </Container>
    </div>
  );
}
