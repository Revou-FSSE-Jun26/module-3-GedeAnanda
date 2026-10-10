import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section" | "aside" | "li";
  padded?: boolean;
}

export default function Card({
  as: Tag = "div",
  padded = true,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={`rounded-lg bg-surface shadow-card ring-1 ring-line/70 ${padded ? "p-4 sm:p-5" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
