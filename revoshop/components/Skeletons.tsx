import type { CSSProperties } from "react";
import Card from "./Card";

export function Skeleton({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <div aria-hidden style={style} className={`rounded-full bg-sunken motion-safe:animate-pulse ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <Card padded={false} className="overflow-hidden">
      <div aria-hidden className="aspect-square bg-sunken motion-safe:animate-pulse" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-5 h-10 w-full" />
      </div>
    </Card>
  );
}

export function LoadingLabel({ children }: { children: string }) {
  return <span className="sr-only">{children}</span>;
}
