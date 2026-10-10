import { Suspense } from "react";
import Logo from "./Logo";
import NavLinks, { NavLinksFallback } from "./NavLinks";
import CartButton from "./CartButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <Logo />
        </div>
        <nav
          aria-label="Main"
          className="order-last w-full pb-3 md:order-none md:w-auto md:pb-0"
        >
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </nav>
        <div className="ml-auto flex h-16 items-center">
          <CartButton />
        </div>
      </div>
    </header>
  );
}
