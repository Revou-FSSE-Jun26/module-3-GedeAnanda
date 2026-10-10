import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="RevoShop home"
      className="shrink-0 rounded-md text-xl font-extrabold tracking-tight text-accent sm:text-2xl"
    >
      Revo<span className="text-ink">Shop</span>
    </Link>
  );
}
