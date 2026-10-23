"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  dimmed?: boolean;
  className?: string;
}

export default function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  dimmed = false,
  className = "",
}: ProductImageProps) {
  // Broken link
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 grid place-items-center bg-sunken text-xs font-medium text-subtle"
      >
        No photo
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailedSrc(src)}
      className={`object-cover ${dimmed ? "opacity-50 grayscale" : ""} ${className}`}
    />
  );
}
