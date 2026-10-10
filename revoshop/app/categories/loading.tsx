import Card from "@/components/Card";
import Container from "@/components/Container";
import { LoadingLabel, Skeleton } from "@/components/Skeletons";

export default function CategoriesLoading() {
  return (
    <Container className="py-8 sm:py-10">
      <div role="status">
        <LoadingLabel>Loading categories</LoadingLabel>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-3 h-4 w-60" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index} padded={false} className="overflow-hidden">
              <div aria-hidden className="aspect-[16/9] bg-sunken motion-safe:animate-pulse" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
