import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  activeId: number | null;
  onSelect: (categoryId: number | null) => void;
}

export default function CategoryFilter({ categories, activeId, onSelect }: CategoryFilterProps) {
  const options = [{ id: null, name: "All" }, ...categories];

  return (
    <div role="group" aria-label="Filter by category" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {options.map((option) => {
        const active = option.id === activeId;
        return (
          <button
            key={option.id ?? "all"}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(option.id)}
            className={`h-9 shrink-0 rounded-full border px-4 text-sm whitespace-nowrap transition-colors duration-200 ${
              active
                ? "border-ink bg-ink font-medium text-canvas"
                : "border-line bg-surface text-muted hover:border-subtle/60 hover:text-ink"
            }`}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}
