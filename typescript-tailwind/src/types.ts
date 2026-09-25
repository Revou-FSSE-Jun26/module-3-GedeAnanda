export type Category = "Electronics" | "Fashion" | "Home";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";


export type Discount =
  | { type: "percent"; value: number }
  | { type: "fixed"; amount: number };

export interface Rating {
  average: number;
  count: number;
}

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number; // dalam Rupiah
  stock: number;
  rating: Rating;
  tags: string[];
  discount?: Discount;
}

export interface CartItem {
  productId: Product["id"];
  quantity: number;
}

export interface CatalogState {
  query: string;
  cart: CartItem[];
}

export interface CartSummary {
  count: number;
  total: number;
}
