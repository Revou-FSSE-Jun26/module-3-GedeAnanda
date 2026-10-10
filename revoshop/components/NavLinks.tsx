"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "Orders" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function LinkList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-1 overflow-x-auto">
      {links.map((link) => {
        const active = pathname !== null && isActive(pathname, link.href);
        return (
          <li key={link.href} className="shrink-0">
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex h-9 items-center rounded-full px-4 text-sm transition-colors duration-200 ${
                active
                  ? "bg-accent-soft font-medium text-on-accent-soft"
                  : "text-muted hover:bg-sunken hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function NavLinks() {
  const pathname = usePathname();
  return <LinkList pathname={pathname} />;
}

// Shown while the pathname is unknown during prerendering of dynamic routes.
export function NavLinksFallback() {
  return <LinkList pathname={null} />;
}
