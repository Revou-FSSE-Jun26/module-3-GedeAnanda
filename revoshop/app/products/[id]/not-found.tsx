import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react/ssr";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-20 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-sunken text-subtle">
        <MagnifyingGlass size={22} aria-hidden />
      </span>
      <h1 className="mt-4 text-xl font-semibold tracking-tight text-ink">Product not found</h1>
      <p className="mt-1 max-w-sm text-sm text-muted">
        It may have been removed from the catalog, or the link has a typo.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition-colors duration-200 hover:bg-accent-hover"
      >
        Back to products
      </Link>
    </div>
  );
}
