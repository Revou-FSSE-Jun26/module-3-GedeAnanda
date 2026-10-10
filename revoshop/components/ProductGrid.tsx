"use client";

import { useEffect, useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import AddProductForm from "./AddProductForm";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import Card from "./Card";
import { pluralize } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
}

const SEARCH_DELAY_MS = 350;

function parseCategory(value: string | null): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearch = searchParams.get("search") ?? "";
  // The URL only changes once the API refetch finishes, so show the clicked
  // category right away and fall back to the URL value afterwards.
  const [activeCategoryId, setOptimisticCategory] = useOptimistic(
    parseCategory(searchParams.get("category")),
  );

  const [query, setQuery] = useState(urlSearch);
  // The search value we last sent to the URL, used to tell our own updates
  // apart from outside ones (a nav link click or the back button).
  const [syncedSearch, setSyncedSearch] = useState(urlSearch);
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!isPending && urlSearch !== syncedSearch) {
    setSyncedSearch(urlSearch);
    setQuery(urlSearch);
  }

  useEffect(() => {
    const timers = debounceRef;
    return () => {
      if (timers.current) clearTimeout(timers.current);
    };
  }, []);

  // Push search + category to the URL. The server page refetches from the API with them.
  function navigate(search: string, categoryId: number | null) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("category", String(categoryId));
    const queryString = params.toString();

    setSyncedSearch(search);
    startTransition(() => {
      setOptimisticCategory(categoryId);
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    });
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => navigate(value.trim(), activeCategoryId), SEARCH_DELAY_MS);
  }

  function handleCategorySelect(categoryId: number | null) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    navigate(query.trim(), categoryId);
  }

  function handleAddProduct(product: Product) {
    setAddedProducts((current) => [...current, product]);
  }

  function clearFilters() {
    setQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    navigate("", null);
  }

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  // Filter on every keystroke so the list reacts before the API refetch lands.
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = [...products, ...addedProducts].filter(
    (product) =>
      (activeCategoryId === null || product.category_id === activeCategoryId) &&
      product.name.toLowerCase().includes(normalizedQuery),
  );

  const heading = activeCategoryId ? (categoryNames.get(activeCategoryId) ?? "Products") : "All products";
  const hasFilters = Boolean(normalizedQuery || activeCategoryId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{heading}</h1>
          <p className="mt-2 text-sm text-muted" aria-live="polite">
            {pluralize(visibleProducts.length, "product")}
            {normalizedQuery && <> matching &ldquo;{query.trim()}&rdquo;</>}
            {isPending && <span className="text-subtle">, updating</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((open) => !open)}
          aria-expanded={showForm}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors duration-200 hover:bg-sunken"
        >
          <Plus size={16} weight="bold" aria-hidden />
          Add product
        </button>
      </div>

      {showForm && (
        <AddProductForm
          categories={categories}
          onAddProduct={handleAddProduct}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-3">
        <SearchBar value={query} onChange={handleSearchChange} />
        <CategoryFilter
          categories={categories}
          activeId={activeCategoryId}
          onSelect={handleCategorySelect}
        />
      </div>

      {visibleProducts.length > 0 ? (
        <ul
          aria-busy={isPending}
          className={`grid grid-cols-2 gap-3 transition-opacity duration-200 sm:gap-5 xl:grid-cols-3 ${
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
                isActive={product.is_active}
                categoryName={
                  product.category_id !== null ? categoryNames.get(product.category_id) : undefined
                }
                href={product.id > 0 ? `/products/${product.id}` : undefined}
                isNew={product.id < 0}
                priority={index < 2}
              />
            </li>
          ))}
        </ul>
      ) : (
        <Card className="flex flex-col items-center py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-sunken text-subtle">
            <MagnifyingGlass size={22} aria-hidden />
          </span>
          <h2 className="mt-4 font-medium text-ink">No products found</h2>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {hasFilters
              ? "Try a different search term or another category."
              : "The API returned an empty catalog. Add a product to get started."}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-medium text-ink transition-colors duration-200 hover:bg-sunken"
            >
              Clear filters
            </button>
          )}
        </Card>
      )}
    </div>
  );
}
