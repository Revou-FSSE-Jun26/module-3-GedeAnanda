import Image from "next/image";

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
  if (!src) {
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
      priority={priority}
      className={`object-cover ${dimmed ? "opacity-50 grayscale" : ""} ${className}`}
    />
  );
}
