import { Suspense } from "react";
import Logo from "./Logo";
import NavLinks, { NavLinksFallback } from "./NavLinks";
import HeaderSearch from "./HeaderSearch";
import CartButton from "./CartButton";
import UserMenu from "./auth/UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface shadow-[0_1px_0_var(--color-line)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:h-16 sm:gap-6 sm:px-6 lg:px-8">
        <Logo />
        <HeaderSearch />
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden md:block">
            <CartButton />
          </div>
          <UserMenu />
        </div>
      </div>
      <nav aria-label="Main" className="hidden border-t border-line md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
