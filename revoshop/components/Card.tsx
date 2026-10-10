import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section" | "aside" | "li";
  padded?: boolean;
}

// Shared surface used by product cards, the cart summary, forms and list rows.
export default function Card({
  as: Tag = "div",
  padded = true,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-surface shadow-card ${padded ? "p-5 sm:p-6" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
