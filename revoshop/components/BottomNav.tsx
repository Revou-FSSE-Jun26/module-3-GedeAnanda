"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Receipt, ShoppingCartSimple, SquaresFour, Storefront, type Icon } from "@phosphor-icons/react";
import { useCart } from "./CartProvider";
import { isActivePath } from "./NavLinks";

const items: { href: string; label: string; icon: Icon }[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/products", label: "Shop", icon: Storefront },
  { href: "/categories", label: "Categories", icon: SquaresFour },
  { href: "/orders", label: "Orders", icon: Receipt },
];

const itemClass = "flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px]";

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  if (pathname.startsWith("/products/")) return null;

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex h-16">
        {items.map(({ href, label, icon: ItemIcon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href} className="flex flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`${itemClass} ${active ? "font-semibold text-accent" : "text-subtle"}`}
              >
                <ItemIcon size={24} weight={active ? "fill" : "regular"} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
        <li className="flex flex-1">
          <button type="button" onClick={openCart} className={`${itemClass} relative text-subtle`}>
            <span className="relative">
              <ShoppingCartSimple size={24} aria-hidden />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white tabular-nums">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </span>
            Cart
          </button>
        </li>
      </ul>
    </nav>
  );
}
