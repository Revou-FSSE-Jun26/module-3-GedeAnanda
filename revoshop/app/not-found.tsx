import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-xl font-bold text-ink">This page does not exist</h1>
      <p className="mt-2 text-sm text-muted">The link may be broken, or the page may have moved.</p>
      <Link
        href="/products"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
      >
        Browse products
      </Link>
    </div>
  );
}
