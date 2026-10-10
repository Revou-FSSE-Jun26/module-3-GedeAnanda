import Container from "@/components/Container";
import CartSummary from "@/components/CartSummary";

// Shared by /products and /products/[id]. It stays mounted while moving between
// them, so the cart column does not re-render on navigation.
export default function ProductsLayout({ children }: LayoutProps<"/products">) {
  return (
    <Container className="py-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:gap-10">
        <div className="min-w-0">{children}</div>
        <aside>
          <CartSummary />
        </aside>
      </div>
    </Container>
  );
}
