import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { getCategories, getProducts } from "@/lib/api";
import { pluralize } from "@/lib/format";

export const metadata: Metadata = {
  title: "Categories",
  description: "Every product category in the RevoShop catalog.",
};

export default async function CategoriesPage() {
  const [categories, { products }] = await Promise.all([getCategories(), getProducts()]);

  const productCounts = products.reduce<Record<number, number>>((counts, product) => {
    if (product.category_id !== null) {
      counts[product.category_id] = (counts[product.category_id] ?? 0) + 1;
    }
    return counts;
  }, {});

  return (
    <Container className="py-8 sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Categories</h1>
      <p className="mt-2 text-sm text-muted">
        {pluralize(categories.length, "category", "categories")} across{" "}
        {pluralize(products.length, "product")}.
      </p>

      {categories.length === 0 ? (
        <Card className="mt-8 py-14 text-center">
          <h2 className="font-medium text-ink">No categories yet</h2>
          <p className="mt-1 text-sm text-muted">Create a category through the API and it will appear here.</p>
        </Card>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {categories.map((category, index) => (
            <li key={category.id} className="grid">
              <Card as="article" padded={false} className="group flex flex-col overflow-hidden">
                <Link href={`/products?category=${category.id}`} className="flex flex-1 flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden bg-sunken">
                    <Image
                      src={`https://picsum.photos/seed/revoshop-category-${category.id}/960/540`}
                      alt=""
                      fill
                      priority={index < 3}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="text-lg font-semibold tracking-tight text-ink">{category.name}</h2>
                      <span className="shrink-0 text-sm text-subtle tabular-nums">
                        {pluralize(productCounts[category.id] ?? 0, "product")}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted">
                      {category.description ?? "Browse every product in this category."}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-accent">
                      Shop {category.name}
                      <ArrowRight
                        size={14}
                        weight="bold"
                        aria-hidden
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
