import { Suspense } from "react";
import CategorySidebar from "@/components/CategorySidebar";
import Container from "@/components/Container";
import { Skeleton } from "@/components/Skeletons";

export default function ProductsLayout({ children }: LayoutProps<"/products">) {
  return (
    <Container className="py-4 sm:py-6">
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-6">
        <aside className="hidden lg:sticky lg:top-32 lg:block">
          <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
            <CategorySidebar />
          </Suspense>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
