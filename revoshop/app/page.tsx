import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/api";
import { formatPrice, pluralize } from "@/lib/format";
import { getProductImage } from "@/lib/images";

export const metadata: Metadata = {
  title: { absolute: "RevoShop | Shop electronics, fashion, home and books" },
};

export default async function HomePage() {
  const [{ products }, categories] = await Promise.all([getProducts(), getCategories()]);
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  // Newest first
  const featured = products
    .filter((product) => product.is_active)
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const categoryCards = categories.map((category) => {
    const items = products.filter((product) => product.category_id === category.id);
    const photoProduct = items.find((product) => getProductImage(product));
    return {
      category,
      count: items.length,
      image: photoProduct ? getProductImage(photoProduct) : undefined,
      fromPrice: items.length > 0 ? Math.min(...items.map((product) => product.price)) : null,
    };
  });
  const [mainBanner, ...sideBanners] = categoryCards.filter((card) => card.image && card.fromPrice).slice(0, 3);

  return (
    <div className="space-y-8 pb-12 sm:space-y-10">
      <h1 className="sr-only">RevoShop online store</h1>

      {mainBanner && (
        <Container className="pt-4 sm:pt-6">
          <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
            <Link
              href={`/products?category=${mainBanner.category.id}`}
              className="group grid min-h-44 grid-cols-[1fr_38%] overflow-hidden rounded-lg bg-accent text-on-accent sm:min-h-64 sm:grid-cols-2"
            >
              <div className="flex flex-col justify-center gap-1.5 p-4 sm:gap-2 sm:p-8">
                <p className="text-xs font-semibold text-white/80 sm:text-sm">{mainBanner.category.name}</p>
                <h2 className="max-w-[18ch] text-lg leading-tight font-bold sm:text-3xl">
                  {mainBanner.category.description ?? `Shop ${mainBanner.category.name}`}
                </h2>
                <p className="text-sm text-white/80">From {formatPrice(mainBanner.fromPrice ?? 0)}</p>
                <span className="mt-2 inline-flex h-9 w-fit items-center rounded-lg bg-white px-3 text-sm font-semibold text-accent transition-colors duration-150 group-hover:bg-accent-soft sm:h-10 sm:px-4">
                  Shop {mainBanner.category.name}
                </span>
              </div>
              <div className="relative">
                <Image
                  src={mainBanner.image ?? ""}
                  alt=""
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 40vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </Link>

            {sideBanners.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-1">
                {sideBanners.map((banner) => (
                  <Link
                    key={banner.category.id}
                    href={`/products?category=${banner.category.id}`}
                    className="group flex items-center gap-2.5 rounded-lg bg-surface p-2.5 shadow-card ring-1 ring-line/70 transition-shadow duration-200 hover:shadow-lift sm:gap-4 sm:p-3"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-sunken sm:size-24">
                      <Image src={banner.image ?? ""} alt="" fill loading="eager" sizes="96px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-ink sm:text-base">{banner.category.name}</span>
                      <span className="mt-0.5 block text-xs text-muted sm:text-sm">
                        From {formatPrice(banner.fromPrice ?? 0)}
                      </span>
                      <span className="mt-1 hidden text-sm font-semibold text-accent group-hover:underline sm:mt-2 sm:block">
                        Shop now
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      )}

      {categoryCards.length > 0 && (
        <Container>
          <section aria-labelledby="categories-heading">
            <div className="flex items-center justify-between gap-3">
              <h2 id="categories-heading" className="text-lg font-bold text-ink sm:text-xl">
                Categories
              </h2>
              <Link href="/categories" className="text-sm font-semibold text-accent hover:underline">
                See all
              </Link>
            </div>
            <ul className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
              {categoryCards.map(({ category, count, image }) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="group flex flex-col items-center gap-2 rounded-lg bg-surface p-2 text-center shadow-card ring-1 ring-line/70 transition-shadow duration-200 hover:shadow-lift sm:flex-row sm:p-3 sm:text-left"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-sunken sm:size-16">
                      {image && <Image src={image} alt="" fill loading="eager" sizes="64px" className="object-cover" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-ink sm:text-sm">{category.name}</span>
                      <span className="hidden text-xs text-subtle sm:block">{pluralize(count, "product")}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      )}

      <Container>
        <section aria-labelledby="featured-heading">
          <div className="flex items-center justify-between gap-3">
            <h2 id="featured-heading" className="text-lg font-bold text-ink sm:text-xl">
              New in the catalog
            </h2>
            <Link href="/products" className="text-sm font-semibold text-accent hover:underline">
              See all
            </Link>
          </div>

          {featured.length === 0 ? (
            <Card className="mt-3 py-14 text-center">
              <p className="font-semibold text-ink">No products yet</p>
              <p className="mt-1 text-sm text-muted">Products created through the API will show up here.</p>
            </Card>
          ) : (
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
              {featured.map((product, index) => (
                <li key={product.id} className="grid">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    stock={product.stock}
                    imageUrl={getProductImage(product)}
                    isActive={product.is_active}
                    categoryName={
                      product.category_id !== null ? categoryNames.get(product.category_id) : undefined
                    }
                    href={`/products/${product.id}`}
                    priority={index < 3}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </Container>
    </div>
  );
}
