import { cache } from "react";
import { ApiError, request } from "./http";
import type {
  Category,
  CategoryWithProducts,
  Order,
  OrderStatus,
  Pagination,
  Product,
} from "./types";

// Server only

export interface ProductQuery {
  search?: string;
  categoryId?: number;
  perPage?: number;
}

export async function getProducts({
  search,
  categoryId,
  perPage = 100,
}: ProductQuery = {}): Promise<{ products: Product[]; pagination?: Pagination }> {
  const params = new URLSearchParams({ per_page: String(perPage) });
  if (search) params.set("search", search);
  if (categoryId) params.set("category_id", String(categoryId));

  const res = await request<Product[]>(`/products?${params}`);
  return { products: res.data, pagination: res.pagination };
}

// Dedupe per request
export const getProduct = cache(async (id: number): Promise<Product | null> => {
  try {
    const res = await request<Product>(`/products/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
});

export async function getCategories(): Promise<Category[]> {
  const res = await request<Category[]>("/categories");
  return res.data;
}

export async function getCategory(id: number): Promise<CategoryWithProducts | null> {
  try {
    const res = await request<CategoryWithProducts>(`/categories/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

async function getAccessToken(): Promise<string | null> {
  const email = process.env.API_AUTH_EMAIL;
  const password = process.env.API_AUTH_PASSWORD;
  if (!email || !password) return null;

  const res = await request<{ access_token: string }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.data.access_token;
}

// null = no creds
export async function getOrders(status?: OrderStatus): Promise<Order[] | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const params = new URLSearchParams({ per_page: "20" });
  if (status) params.set("status", status);

  const headers = { Authorization: `Bearer ${token}` };
  const list = await request<Order[]>(`/orders?${params}`, { headers });

  // Need line items
  return Promise.all(
    list.data.map(async (order) => {
      const res = await request<Order>(`/orders/${order.id}`, { headers });
      return res.data;
    }),
  );
}
