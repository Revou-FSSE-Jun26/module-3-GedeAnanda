import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import Card from "@/components/Card";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: { absolute: "RevoShop | Everyday goods, honest prices" },
};

export default async function HomePage() {
  const [{ products }, categories] = await Promise.all([getProducts({ perPage: 5 }), getCategories()]);
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <>
      <Container className="grid items-center gap-10 pt-8 pb-16 md:grid-cols-[1.1fr_1fr] md:pt-14 lg:gap-16">
        <div className="motion-safe:animate-rise">
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-tighter text-balance text-ink sm:text-5xl lg:text-6xl">
            Everyday goods, honest prices.
          </h1>
          <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-muted sm:text-lg">
            Browse the full RevoShop catalog, filter by category, and build your cart in a few clicks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition-[background-color,transform] duration-200 hover:bg-accent-hover active:scale-[0.98]"
            >
              Shop products
              <ArrowRight size={16} weight="bold" aria-hidden />
            </Link>
            <Link
              href="/categories"
              className="inline-flex h-12 items-center rounded-full border border-line bg-surface px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-sunken"
            >
              Browse categories
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sunken md:aspect-[5/6] lg:aspect-[6/5]">
          <Image
            src="https://picsum.photos/seed/revoshop-storefront/1200/1000"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>

      <Container className="pb-20">
        <section aria-labelledby="featured-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="featured-heading" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Fresh in the catalog
              </h2>
              <p className="mt-2 text-sm text-muted">Five products, loaded live from the RevoShop API.</p>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent"
            >
              View all products
              <ArrowRight
                size={14}
                weight="bold"
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {products.length === 0 && (
            <Card className="mt-8 py-14 text-center">
              <h3 className="font-medium text-ink">No products yet</h3>
              <p className="mt-1 text-sm text-muted">Products created through the API will show up here.</p>
            </Card>
          )}

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => (
              <li key={product.id} className="grid">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  stock={product.stock}
                  isActive={product.is_active}
                  categoryName={
                    product.category_id !== null ? categoryNames.get(product.category_id) : undefined
                  }
                  href={`/products/${product.id}`}
                />
              </li>
            ))}
          </ul>
        </section>
      </Container>

      {categories.length > 0 && (
        <section aria-labelledby="categories-heading" className="border-t border-line bg-surface">
          <Container className="py-16">
            <h2 id="categories-heading" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Shop by category
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <li key={category.id} className="grid">
                  <Link
                    href={`/products?category=${category.id}`}
                    className="group flex flex-col justify-between gap-8 rounded-2xl border border-line bg-canvas p-5 transition-colors duration-200 hover:border-ink/25"
                  >
                    <div>
                      <p className="font-medium text-ink">{category.name}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {category.description ?? "Browse every product in this category."}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      Browse
                      <ArrowRight
                        size={14}
                        weight="bold"
                        aria-hidden
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
