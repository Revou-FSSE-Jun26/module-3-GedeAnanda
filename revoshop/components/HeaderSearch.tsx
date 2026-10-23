"use client";

import type { FormEvent } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import SearchBar from "./SearchBar";
import { useCatalog } from "@/hooks/useCatalog";

export default function HeaderSearch() {
  const { query, setQuery, submitSearch, isPending } = useCatalog();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitSearch();
    // Hide keyboard
    const input = event.currentTarget.querySelector("input");
    input?.blur();
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex min-w-0 flex-1 items-center">
      <SearchBar
        id="site-search"
        value={query}
        onChange={setQuery}
        placeholder="Search products"
        label="Search products"
        className="rounded-r-none md:rounded-r-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-r-lg bg-accent px-3 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover sm:px-5"
      >
        <MagnifyingGlass size={18} weight="bold" aria-hidden className={isPending ? "animate-pulse" : ""} />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}
