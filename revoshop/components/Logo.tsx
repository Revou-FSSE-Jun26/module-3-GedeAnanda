import Link from "next/link";
import { ShoppingBagOpen } from "@phosphor-icons/react/ssr";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 rounded-full">
      <span className="grid size-8 place-items-center rounded-xl bg-accent text-on-accent">
        <ShoppingBagOpen size={18} weight="bold" aria-hidden />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-ink">RevoShop</span>
    </Link>
  );
}
