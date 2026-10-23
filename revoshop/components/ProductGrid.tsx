"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./Card";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";
import { useCatalog } from "@/hooks/useCatalog";
import { pluralize } from "@/lib/format";
import { getProductImage } from "@/lib/images";
import type { Category, Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
}

type SortKey = "relevance" | "price-asc" | "price-desc" | "name";

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  relevance: () => 0,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

function parseCategory(value: string | null): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const searchParams = useSearchParams();
  const { query, categoryId, isPending, syncFromUrl, leaveCatalog, clearFilters } = useCatalog();
  const [sort, setSort] = useState<SortKey>("relevance");
  const [inStockOnly, setInStockOnly] = useState(false);

  const urlSearch = searchParams.get("search") ?? "";
  const urlCategory = parseCategory(searchParams.get("category"));

  useEffect(() => {
    if (!isPending) syncFromUrl(urlSearch, urlCategory);
  }, [urlSearch, urlCategory, isPending, syncFromUrl]);

  // On unmount
  useEffect(() => leaveCatalog, [leaveCatalog]);

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products
    .filter(
      (product) =>
        (categoryId === null || product.category_id === categoryId) &&
        product.name.toLowerCase().includes(normalizedQuery) &&
        (!inStockOnly || (product.is_active && product.stock > 0)),
    )
    .sort(sorters[sort]);

  const categoryName = categoryId ? categoryNames.get(categoryId) : undefined;
  const heading = normalizedQuery ? `Results for "${query.trim()}"` : (categoryName ?? "All products");
  const hasFilters = Boolean(normalizedQuery || categoryId || inStockOnly);

  function handleClearFilters() {
    setInStockOnly(false);
    clearFilters();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-ink sm:text-2xl">{heading}</h1>
          <p className="mt-0.5 text-sm text-muted" aria-live="polite">
            {pluralize(visibleProducts.length, "product")}
            {categoryName && normalizedQuery && <> in {categoryName}</>}
            {isPending && <span className="text-subtle">, updating</span>}
          </p>
        </div>
      </div>

      <div className="lg:hidden">
        <CategoryFilter categories={categories} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface px-3 py-2 ring-1 ring-line/70">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
            className="size-4 accent-accent"
          />
          In stock only
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-muted">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="h-9 rounded-lg border border-line bg-surface px-2 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="relevance">Most relevant</option>
            <option value="price-asc">Lowest price</option>
            <option value="price-desc">Highest price</option>
            <option value="name">Name, A to Z</option>
          </select>
        </label>
      </div>

      {visibleProducts.length > 0 ? (
        <ul
          aria-busy={isPending}
          className={`grid grid-cols-2 gap-2 transition-opacity duration-200 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 ${
            isPending ? "opacity-60" : ""
          }`}
        >
          {visibleProducts.map((product, index) => (
            <li key={product.id} className="grid">
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                imageUrl={getProductImage(product)}
                isActive={product.is_active}
                categoryName={
                  product.category_id !== null ? categoryNames.get(product.category_id) : undefined
                }
                href={`/products/${product.id}`}
                priority={index < 4}
              />
            </li>
          ))}
        </ul>
      ) : (
        <Card className="py-14 text-center">
          <h2 className="font-semibold text-ink">No products found</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            {hasFilters
              ? "Try another keyword, a different category, or include sold out items."
              : "The catalog is empty right now. Check back soon."}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-5 h-10 rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
            >
              Clear filters
            </button>
          )}
        </Card>
      )}

    </div>
  );
}
