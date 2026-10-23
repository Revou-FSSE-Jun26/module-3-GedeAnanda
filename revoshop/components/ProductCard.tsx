"use client";

import Link from "next/link";
import { useState } from "react";
import Card from "./Card";
import ProductImage from "./ProductImage";
import QuantityCounter from "./QuantityCounter";
import StockLabel from "./StockLabel";
import { useCart } from "@/hooks/useCart";
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
  isNew?: boolean;
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
  isNew = false,
  priority = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inStock = isActive && stock > 0;

  function handleAddToCart() {
    addItem({ productId: id, name, price, quantity, stock, imageUrl });
    setQuantity(1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

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
        {isNew && (
          <span className="mt-1.5 self-start rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold text-on-accent-soft">
            Added by you
          </span>
        )}

        <div className="mt-auto pt-3">
          {inStock ? (
            <div className="flex items-center gap-2">
              <QuantityCounter size="sm" value={quantity} onChange={setQuantity} max={stock} />
              <button
                type="button"
                onClick={handleAddToCart}
                aria-label={`Add ${quantity} ${name} to cart`}
                className="h-8 min-w-0 flex-1 rounded-lg bg-accent px-2 text-sm font-semibold whitespace-nowrap text-on-accent transition-[background-color,transform] duration-150 hover:bg-accent-hover active:scale-[0.97]"
              >
                {justAdded ? (
                  "Added"
                ) : (
                  <>
                    <span className="@[13rem]:hidden">Add</span>
                    <span className="hidden @[13rem]:inline">Add to cart</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="h-8 w-full cursor-not-allowed rounded-lg bg-sunken text-sm font-semibold text-subtle"
            >
              {isActive ? "Out of stock" : "Unavailable"}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
