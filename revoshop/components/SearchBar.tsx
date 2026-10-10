import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

// Controlled input: the parent owns the value and decides what typing does.
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search products",
  label = "Search products",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <label htmlFor="product-search" className="sr-only">
        {label}
      </label>
      <MagnifyingGlass
        size={18}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-subtle"
      />
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-11 w-full rounded-full border border-line bg-surface pr-11 pl-11 text-sm text-ink transition-colors duration-200 placeholder:text-subtle hover:border-subtle/60 focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-subtle transition-colors duration-200 hover:bg-sunken hover:text-ink"
        >
          <X size={14} weight="bold" aria-hidden />
        </button>
      )}
    </div>
  );
}
