import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretRight } from "@phosphor-icons/react/ssr";
import AddToCartPanel from "@/components/AddToCartPanel";
import Card from "@/components/Card";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import StockLabel from "@/components/StockLabel";
import { getCategory, getProduct } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { getProductImage } from "@/lib/images";

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
  const related = category?.products.filter((item) => item.id !== product.id).slice(0, 4) ?? [];
  const imageUrl = getProductImage(product);
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    ...(category ? [{ href: `/products?category=${category.id}`, label: category.name }] : []),
  ];

  return (
    <div className="space-y-6 pb-4 md:pb-0">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-subtle">
          {breadcrumbs.map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-1">
              <Link href={crumb.href} className="text-accent hover:underline">
                {crumb.label}
              </Link>
              <CaretRight size={12} aria-hidden />
            </li>
          ))}
          <li aria-current="page" className="max-w-[28ch] truncate text-muted">
            {product.name}
          </li>
        </ol>
      </nav>

      <Card as="article" className="grid gap-6 md:grid-cols-2 lg:gap-8">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-sunken">
          <ProductImage
            src={imageUrl}
            alt={product.name}
            priority
            sizes="(min-width: 1024px) 36vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">{product.name}</h1>
            <p className="mt-1 text-sm text-subtle">
              <StockLabel stock={product.stock} isActive={product.is_active} />
            </p>
            <p className="mt-3 text-3xl font-bold text-ink tabular-nums">{formatPrice(product.price)}</p>
          </div>

          <dl className="grid grid-cols-[7rem_1fr] gap-y-2 border-y border-line py-4 text-sm">
            <dt className="text-subtle">Category</dt>
            <dd>
              {category ? (
                <Link href={`/products?category=${category.id}`} className="font-semibold text-accent hover:underline">
                  {category.name}
                </Link>
              ) : (
                <span className="text-muted">Uncategorized</span>
              )}
            </dd>
            <dt className="text-subtle">Stock</dt>
            <dd className="text-ink tabular-nums">{product.stock}</dd>
            <dt className="text-subtle">Listed</dt>
            <dd className="text-ink">{formatDate(product.created_at)}</dd>
          </dl>

          <div>
            <h2 className="text-sm font-bold text-ink">Description</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {product.description ?? "The seller has not added a description yet."}
            </p>
          </div>

          <AddToCartPanel
            id={product.id}
            name={product.name}
            price={product.price}
            stock={product.stock}
            imageUrl={imageUrl}
            isActive={product.is_active}
          />
        </div>
      </Card>

      {category && related.length > 0 && (
        <section aria-labelledby="related-heading">
          <div className="flex items-center justify-between gap-3">
            <h2 id="related-heading" className="text-lg font-bold text-ink">
              More from {category.name}
            </h2>
            <Link href={`/products?category=${category.id}`} className="text-sm font-semibold text-accent hover:underline">
              See all
            </Link>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4">
            {related.map((item) => (
              <li key={item.id} className="grid">
                <ProductCard
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  stock={item.stock}
                  imageUrl={getProductImage(item)}
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
