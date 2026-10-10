import { X } from "@phosphor-icons/react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search products",
  label = "Search products",
  id = "product-search",
  className = "",
}: SearchBarProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        className={`h-10 w-full rounded-lg border border-line bg-surface pr-10 pl-3.5 text-sm text-ink transition-colors duration-150 placeholder:text-subtle hover:border-subtle/50 focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:appearance-none ${className}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 grid size-7 -translate-y-1/2 place-items-center rounded-md text-subtle transition-colors duration-150 hover:bg-sunken hover:text-ink"
        >
          <X size={14} weight="bold" aria-hidden />
        </button>
      )}
    </div>
  );
}
