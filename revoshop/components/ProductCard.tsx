"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ShoppingCartSimple } from "@phosphor-icons/react";
import Card from "./Card";
import QuantityCounter from "./QuantityCounter";
import StockLabel from "./StockLabel";
import { useCart } from "./CartProvider";
import { formatPrice, productImage } from "@/lib/format";

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryName?: string;
  imageUrl?: string;
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
  categoryName = "Uncategorized",
  imageUrl = productImage(id, 640),
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
    addItem({ productId: id, name, price, quantity, stock });
    setQuantity(1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  const image = (
    <div className="relative aspect-square overflow-hidden bg-sunken">
      <Image
        src={imageUrl}
        alt={name}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
        className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
          inStock ? "" : "opacity-60 grayscale"
        }`}
      />
    </div>
  );

  return (
    <Card as="article" padded={false} className="group @container flex flex-col overflow-hidden">
      {href ? (
        <Link href={href} tabIndex={-1} aria-hidden>
          {image}
        </Link>
      ) : (
        image
      )}

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-xs text-subtle">
            <span className="truncate">{categoryName}</span>
            {isNew && (
              <span className="rounded-full bg-accent-soft px-2 py-0.5 font-medium text-on-accent-soft">
                New
              </span>
            )}
          </p>
          <h3 className="line-clamp-2 font-medium leading-snug text-ink">
            {href ? (
              <Link href={href} className="transition-colors duration-200 hover:text-accent">
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="font-semibold tabular-nums text-ink">{formatPrice(price)}</p>
          <StockLabel stock={stock} isActive={isActive} className="text-xs" />
        </div>

        <div className="mt-auto">
          {inStock ? (
            <div className="flex flex-col gap-2 @[17rem]:flex-row @[17rem]:items-center">
              <QuantityCounter
                value={quantity}
                onChange={setQuantity}
                max={stock}
                className="justify-between @[17rem]:justify-start"
              />
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-medium whitespace-nowrap text-on-accent transition-[background-color,transform] duration-200 hover:bg-accent-hover active:scale-[0.98] @[17rem]:flex-1"
              >
                {justAdded ? (
                  <>
                    <Check size={16} weight="bold" aria-hidden /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCartSimple size={16} weight="bold" aria-hidden /> Add to cart
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-10 w-full cursor-not-allowed items-center justify-center rounded-full border border-dashed border-line bg-sunken text-sm font-medium text-subtle"
            >
              {isActive ? "Out of stock" : "Unavailable"}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
