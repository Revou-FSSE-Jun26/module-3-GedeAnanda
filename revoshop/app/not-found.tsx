import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-subtle">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">This page does not exist</h1>
      <p className="mt-2 text-sm text-muted">The link may be broken, or the page may have moved.</p>
      <Link
        href="/products"
        className="mt-7 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition-colors duration-200 hover:bg-accent-hover"
      >
        Shop products
      </Link>
    </div>
  );
}
