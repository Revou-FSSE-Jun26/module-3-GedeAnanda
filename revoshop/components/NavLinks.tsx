"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "My orders" },
];

export function isActivePath(pathname: string | null, href: string): boolean {
  if (pathname === null) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function LinkList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex h-11 items-stretch gap-6">
      {navLinks.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <li key={link.href} className="flex">
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center border-b-2 text-sm transition-colors duration-150 ${
                active
                  ? "border-accent font-semibold text-accent"
                  : "border-transparent text-muted hover:text-ink"
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

export function NavLinksFallback() {
  return <LinkList pathname={null} />;
}
