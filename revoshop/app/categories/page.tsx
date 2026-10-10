import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { getCategories, getProducts } from "@/lib/api";
import { formatPrice, pluralize } from "@/lib/format";
import { getProductImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Categories",
  description: "Every product category in the RevoShop catalog.",
};

export default async function CategoriesPage() {
  const [categories, { products }] = await Promise.all([getCategories(), getProducts()]);

  return (
    <Container className="py-4 sm:py-6">
      <h1 className="text-xl font-bold text-ink sm:text-2xl">Categories</h1>
      <p className="mt-0.5 text-sm text-muted">
        {pluralize(categories.length, "category", "categories")}, {pluralize(products.length, "product")} in total.
      </p>

      {categories.length === 0 ? (
        <Card className="mt-4 py-14 text-center">
          <h2 className="font-semibold text-ink">No categories yet</h2>
          <p className="mt-1 text-sm text-muted">Create a category through the API and it will appear here.</p>
        </Card>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const items = products.filter((product) => product.category_id === category.id);
            const photos = items
              .map((product) => ({ id: product.id, name: product.name, src: getProductImage(product) }))
              .filter((photo): photo is { id: number; name: string; src: string } => Boolean(photo.src));
            const fromPrice = items.length > 0 ? Math.min(...items.map((product) => product.price)) : null;

            return (
              <li key={category.id} className="grid">
                <Card
                  as="article"
                  padded={false}
                  className="group flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lift"
                >
                  <Link href={`/products?category=${category.id}`} className="flex flex-1 flex-col">
                    <div className="relative aspect-[4/3] bg-sunken">
                      {photos[0] && (
                        <Image
                          src={photos[0].src}
                          alt={photos[0].name}
                          fill
                          priority={index < 4}
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <h2 className="font-bold text-ink">{category.name}</h2>
                        <span className="shrink-0 text-xs text-subtle">{pluralize(items.length, "product")}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {category.description ?? "Browse every product in this category."}
                      </p>
                      {photos.length > 1 && (
                        <div className="mt-3 flex gap-1.5">
                          {photos.slice(1, 5).map((photo) => (
                            <span key={photo.id} className="relative size-10 overflow-hidden rounded-md bg-sunken">
                              <Image src={photo.src} alt="" fill sizes="40px" className="object-cover" />
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm">
                        <span className="text-muted">{fromPrice !== null && <>From {formatPrice(fromPrice)}</>}</span>
                        <span className="font-semibold text-accent group-hover:underline">Shop</span>
                      </div>
                    </div>
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
