"use client";

import { useCatalog } from "./CatalogProvider";
import type { Category } from "@/lib/types";

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const { categoryId, selectCategory } = useCatalog();
  const options = [{ id: null, name: "All" }, ...categories];

  return (
    <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {options.map((option) => {
        const active = option.id === categoryId;
        return (
          <button
            key={option.id ?? "all"}
            type="button"
            aria-pressed={active}
            onClick={() => selectCategory(option.id)}
            className={`h-9 shrink-0 rounded-lg border px-3.5 text-sm whitespace-nowrap transition-colors duration-150 ${
              active
                ? "border-accent bg-accent-soft font-semibold text-on-accent-soft"
                : "border-line bg-surface text-muted hover:border-accent/50 hover:text-ink"
            }`}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}
