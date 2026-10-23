import type { Metadata } from "next";
import ProductManager from "@/components/dashboard/ProductManager";
import { getCategories, getProducts } from "@/lib/api";

// Behind client guard
export const instant = false;

export const metadata: Metadata = { title: "Products" };

export default async function DashboardProductsPage() {
  const [{ products }, categories] = await Promise.all([getProducts(), getCategories()]);
  return <ProductManager products={products} categories={categories} />;
}
