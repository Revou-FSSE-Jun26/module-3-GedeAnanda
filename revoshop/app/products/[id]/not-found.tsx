import Link from "next/link";
import Card from "@/components/Card";

export default function ProductNotFound() {
  return (
    <Card className="px-6 py-16 text-center">
      <h1 className="text-lg font-bold text-ink">Product not found</h1>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
        It may have been removed from the catalog, or the link has a typo.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
      >
        Back to products
      </Link>
    </Card>
  );
}
