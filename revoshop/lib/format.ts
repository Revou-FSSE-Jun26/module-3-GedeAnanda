const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatPrice(value: number): string {
  return rupiah.format(value);
}

export function formatDate(iso: string | null): string {
  if (!iso) return "Unknown date";
  return shortDate.format(new Date(iso));
}

// The API has no image field yet, so every product gets a stable placeholder photo.
export function productImage(seed: number | string, size = 800): string {
  return `https://picsum.photos/seed/revoshop-${seed}/${size}/${size}`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
