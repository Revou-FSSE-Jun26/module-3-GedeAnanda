"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Receipt, SquaresFour, type Icon } from "@phosphor-icons/react";

const tabs: { href: string; label: string; icon: Icon }[] = [
  { href: "/dashboard", label: "Products", icon: Package },
  { href: "/dashboard/categories", label: "Categories", icon: SquaresFour },
  { href: "/dashboard/orders", label: "Orders", icon: Receipt },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-6">
        {tabs.map(({ href, label, icon: TabIcon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-11 items-center gap-2 border-b-2 text-sm whitespace-nowrap transition-colors duration-150 ${
                  active ? "border-accent font-semibold text-accent" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <TabIcon size={18} weight={active ? "fill" : "regular"} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
