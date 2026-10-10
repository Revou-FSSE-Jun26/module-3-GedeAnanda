import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import AddToCartPanel from "@/components/AddToCartPanel";
import ProductCard from "@/components/ProductCard";
import StockLabel from "@/components/StockLabel";
import { getCategory, getProduct } from "@/lib/api";
import { formatDate, formatPrice, productImage } from "@/lib/format";

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const id = parseId((await params).id);
  const product = id ? await getProduct(id) : null;

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description ?? `Buy ${product.name} on RevoShop for ${formatPrice(product.price)}.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[id]">) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const product = await getProduct(id);
  if (!product) notFound();

  const category = product.category_id ? await getCategory(product.category_id) : null;
  const related = category?.products.filter((item) => item.id !== product.id).slice(0, 3) ?? [];

  return (
    <div className="space-y-14">
      <div>
        <Link
          href="/products"
          className="inline-flex h-9 items-center gap-1.5 rounded-full pr-3 text-sm text-muted transition-colors duration-200 hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          All products
        </Link>

        <article className="mt-4 grid gap-8 md:grid-cols-2 md:gap-10">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-sunken">
            <Image
              src={productImage(product.id, 1000)}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            {category && (
              <Link
                href={`/products?category=${category.id}`}
                className="self-start rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-on-accent-soft transition-opacity duration-200 hover:opacity-80"
              >
                {category.name}
              </Link>
            )}
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-ink">{formatPrice(product.price)}</p>
            <p className="mt-6 max-w-[60ch] leading-relaxed text-muted">
              {product.description ?? "No description has been added for this product yet."}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-line p-4 text-sm">
              <div>
                <dt className="text-subtle">Availability</dt>
                <dd className="mt-1">
                  <StockLabel stock={product.stock} isActive={product.is_active} />
                </dd>
              </div>
              <div>
                <dt className="text-subtle">Listed</dt>
                <dd className="mt-1 text-ink">{formatDate(product.created_at)}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <AddToCartPanel
                id={product.id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                isActive={product.is_active}
              />
            </div>
          </div>
        </article>
      </div>

      {category && related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-semibold tracking-tight text-ink">
            More from {category.name}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {related.map((item) => (
              <li key={item.id} className="grid">
                <ProductCard
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  stock={item.stock}
                  isActive={item.is_active}
                  categoryName={category.name}
                  href={`/products/${item.id}`}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
