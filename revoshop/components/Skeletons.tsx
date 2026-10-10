import type { CSSProperties } from "react";
import Card from "./Card";

export function Skeleton({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <div aria-hidden style={style} className={`rounded-md bg-line/60 motion-safe:animate-pulse ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <Card padded={false}>
      <div aria-hidden className="aspect-square rounded-t-lg bg-line/60 motion-safe:animate-pulse" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="mt-3 h-8 w-full rounded-lg" />
      </div>
    </Card>
  );
}

export function LoadingLabel({ children }: { children: string }) {
  return <span className="sr-only">{children}</span>;
}
