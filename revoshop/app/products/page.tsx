import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Products",
  description: "Search and filter every product in the RevoShop catalog.",
};

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const params = await searchParams;
  const search = firstValue(params.search);
  const categoryId = Number(firstValue(params.category));

  const [{ products }, categories] = await Promise.all([
    getProducts({
      search: search || undefined,
      categoryId: Number.isInteger(categoryId) && categoryId > 0 ? categoryId : undefined,
    }),
    getCategories(),
  ]);

  return <ProductGrid products={products} categories={categories} />;
}
