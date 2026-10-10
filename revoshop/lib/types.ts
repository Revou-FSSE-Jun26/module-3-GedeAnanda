// Shapes returned by the RevoShop Flask API (Module 2).

export interface Product {
  id: number;
  category_id: number | null;
  name: string;
  price: number;
  stock: number;
  description: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export type OrderStatus = "pending" | "paid" | "shipped" | "completed" | "cancelled";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: Product | null;
}

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  created_at: string | null;
  items?: OrderItem[];
}

export interface Pagination {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  pagination?: Pagination;
}

// Client-side cart line. Prices are copied in so the cart does not need the API.
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}
