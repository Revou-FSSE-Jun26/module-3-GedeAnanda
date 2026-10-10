import type { Product } from "./types";

function unsplash(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?w=1200&q=80&auto=format&fit=crop`;
}

// Fallback photos
const photosByName: Record<string, string> = {
  "wireless mouse": unsplash("photo-1739742473235-34a7bd9b8f87"),
  "mechanical keyboard": unsplash("photo-1616998846741-1075249f6379"),
  "usb-c hub": unsplash("photo-1616578273518-450dd375759b"),
  "denim jacket": unsplash("photo-1602370087990-45153f02841b"),
  "canvas sneakers": unsplash("photo-1650320079970-b4ee8f0dae33"),
  "cotton t-shirt": unsplash("photo-1620799139507-2a76f79a2f4d"),
  "desk lamp": unsplash("photo-1533090161767-e6ffed986c88"),
  "ceramic mug": unsplash("photo-1455813870877-04a32045af63"),
  "dot grid notebook": unsplash("photo-1520970014086-2208d157c9e2"),
};

export function getProductImage(product: Pick<Product, "name" | "image_url">): string | undefined {
  return product.image_url || photosByName[product.name.trim().toLowerCase()];
}
