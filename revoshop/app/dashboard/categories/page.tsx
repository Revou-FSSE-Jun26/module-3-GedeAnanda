import type { Metadata } from "next";
import CategoryManager from "@/components/dashboard/CategoryManager";
import { getCategories, getProducts } from "@/lib/api";

// Behind client guard
export const instant = false;

export const metadata: Metadata = { title: "Categories" };

export default async function DashboardCategoriesPage() {
  const [categories, { products }] = await Promise.all([getCategories(), getProducts()]);

  const productCounts = products.reduce<Record<number, number>>((counts, product) => {
    if (product.category_id !== null) counts[product.category_id] = (counts[product.category_id] ?? 0) + 1;
    return counts;
  }, {});

  return <CategoryManager categories={categories} productCounts={productCounts} />;
}
