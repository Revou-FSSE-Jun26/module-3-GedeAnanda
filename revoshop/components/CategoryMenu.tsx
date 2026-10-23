"use client";

import Card from "./Card";
import { useCatalog } from "@/hooks/useCatalog";
import type { Category } from "@/lib/types";

interface CategoryMenuProps {
  categories: Category[];
  counts: Record<number, number>;
  total: number;
}

export default function CategoryMenu({ categories, counts, total }: CategoryMenuProps) {
  const { categoryId, isOnCatalog, selectCategory } = useCatalog();
  const options = [
    { id: null, name: "All products", count: total },
    ...categories.map((category) => ({ id: category.id, name: category.name, count: counts[category.id] ?? 0 })),
  ];

  return (
    <Card padded={false} className="p-2">
      <h2 className="px-3 pt-2 pb-2 text-sm font-bold text-ink">Categories</h2>
      <ul className="space-y-0.5">
        {options.map((option) => {
          const active = isOnCatalog && option.id === categoryId;
          return (
            <li key={option.id ?? "all"}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => selectCategory(option.id)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors duration-150 ${
                  active ? "bg-accent-soft font-semibold text-on-accent-soft" : "text-muted hover:bg-sunken hover:text-ink"
                }`}
              >
                <span className="truncate">{option.name}</span>
                <span className="text-xs text-subtle tabular-nums">{option.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
