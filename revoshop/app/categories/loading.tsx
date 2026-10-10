import Card from "@/components/Card";
import Container from "@/components/Container";
import { LoadingLabel, Skeleton } from "@/components/Skeletons";

export default function CategoriesLoading() {
  return (
    <Container className="py-4 sm:py-6">
      <div role="status">
        <LoadingLabel>Loading categories</LoadingLabel>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index} padded={false}>
              <div aria-hidden className="aspect-[4/3] rounded-t-lg bg-line/60 motion-safe:animate-pulse" />
              <div className="space-y-2 p-4">
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
