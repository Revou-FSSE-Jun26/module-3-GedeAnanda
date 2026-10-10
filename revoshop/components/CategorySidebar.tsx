import CategoryMenu from "./CategoryMenu";
import { getCategories, getProducts } from "@/lib/api";

export default async function CategorySidebar() {
  const [categories, { products }] = await Promise.all([getCategories(), getProducts()]);

  const counts = products.reduce<Record<number, number>>((result, product) => {
    if (product.category_id !== null) result[product.category_id] = (result[product.category_id] ?? 0) + 1;
    return result;
  }, {});

  return <CategoryMenu categories={categories} counts={counts} total={products.length} />;
}
