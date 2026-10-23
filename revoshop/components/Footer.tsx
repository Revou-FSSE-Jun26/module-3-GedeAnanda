import Link from "next/link";
import Logo from "./Logo";

const groups = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/categories", label: "Categories" },
    ],
  },
  {
    title: "Your account",
    links: [{ href: "/orders", label: "My orders" }],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Electronics, fashion, home goods and books, with live stock from the RevoShop API.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-bold text-ink">{group.title}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors duration-150 hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-subtle sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; 2026 RevoShop</p>
          <p>Built for RevoU Software Engineering, Module 3</p>
        </div>
      </div>
    </footer>
  );
}
