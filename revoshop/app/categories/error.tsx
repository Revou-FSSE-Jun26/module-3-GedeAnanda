"use client";

import ErrorState from "@/components/ErrorState";

export default function CategoriesError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <ErrorState error={error} retry={retry} title="We couldn't load categories" />;
}
