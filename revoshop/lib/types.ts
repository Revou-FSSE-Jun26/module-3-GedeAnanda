export interface Product {
  id: number;
  category_id: number | null;
  name: string;
  price: number;
  stock: number;
  description: string | null;
  is_active: boolean;
  // Not in API yet
  image_url?: string | null;
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

export const ORDER_STATUSES = ["pending", "paid", "shipped", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

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

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl?: string;
}

export type Role = "customer" | "admin";

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  created_at: string | null;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
}
