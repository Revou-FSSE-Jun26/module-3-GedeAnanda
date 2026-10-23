import { cache } from "react";
import { ApiError, request } from "./http";
import type {
  Category,
  CategoryWithProducts,
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
