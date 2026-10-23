"use client";

import Link from "next/link";
import { useState } from "react";
import Card from "./Card";
import ProductImage from "./ProductImage";
import QuantityCounter from "./QuantityCounter";
import StockLabel from "./StockLabel";
import AddToCartButton from "./cart/AddToCartButton";
import { formatPrice } from "@/lib/format";

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryName?: string;
  href?: string;
  isActive?: boolean;
  priority?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  stock,
  imageUrl,
  categoryName = "Uncategorized",
  href,
  isActive = true,
  priority = false,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const inStock = isActive && stock > 0;

  const image = (
    <div className="relative aspect-square overflow-hidden rounded-t-lg bg-sunken">
      <ProductImage
        src={imageUrl}
        alt={name}
        priority={priority}
        dimmed={!inStock}
        sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
        className="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );

  return (
    <Card
      as="article"
      padded={false}
      className="group @container flex flex-col transition-shadow duration-200 hover:shadow-lift"
    >
      {href ? (
        <Link href={href} tabIndex={-1} aria-hidden>
          {image}
        </Link>
      ) : (
        image
      )}

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 min-h-[2.5em] text-sm leading-[1.25] text-ink">
          {href ? (
            <Link href={href} className="hover:text-accent">
              {name}
            </Link>
          ) : (
            name
          )}
        </h3>
        <p className="mt-1 text-base font-bold text-ink tabular-nums">{formatPrice(price)}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-subtle">
          <span className="truncate">{categoryName}</span>
          <span aria-hidden>&middot;</span>
          <StockLabel stock={stock} isActive={isActive} />
        </p>

        <div className="mt-auto flex items-center gap-2 pt-3">
          {inStock && <QuantityCounter size="sm" value={quantity} onChange={setQuantity} max={stock} />}
          <AddToCartButton
            productId={id}
            name={name}
            price={price}
            stock={stock}
            imageUrl={imageUrl}
            isActive={isActive}
            quantity={quantity}
            onAdded={() => setQuantity(1)}
            ariaLabel={`Add ${quantity} ${name} to cart`}
            className="h-8 min-w-0 flex-1 px-2"
          >
            <span className="@[13rem]:hidden">Add</span>
            <span className="hidden @[13rem]:inline">Add to cart</span>
          </AddToCartButton>
        </div>
      </div>
    </Card>
  );
}
