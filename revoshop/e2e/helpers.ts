import { expect, type APIRequestContext, type Page } from "@playwright/test";

export const API_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
export const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "";
export const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "";

interface ApiProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category_id: number | null;
  is_active: boolean;
}

export function uniqueId(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function newCustomer() {
  const id = uniqueId();
  return { username: `E2E ${id.slice(-6)}`, email: `e2e+${id}@revoshop.test`, password: "password123" };
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export function pathname(page: Page): string {
  return new URL(page.url()).pathname;
}

export async function expectPath(page: Page, path: string) {
  await expect.poll(() => pathname(page)).toBe(path);
}

// Hydrated guest header
export async function waitForGuestHeader(page: Page) {
  await expect(page.getByRole("banner").getByRole("link", { name: "Log in" })).toBeVisible();
}

export async function loginViaUi(page: Page, email: string, password: string) {
  await page.goto("/login");
  await waitForGuestHeader(page);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
}

export async function registerViaApi(request: APIRequestContext, user: ReturnType<typeof newCustomer>) {
  const res = await request.post(`${API_URL}/auth/register`, { data: user });
  expect(res.status()).toBe(201);
}

export async function apiToken(request: APIRequestContext, email: string, password: string): Promise<string> {
  const res = await request.post(`${API_URL}/auth/login`, { data: { email, password } });
  expect(res.ok()).toBeTruthy();
  return (await res.json()).data.access_token;
}

export async function getProducts(request: APIRequestContext): Promise<ApiProduct[]> {
  const res = await request.get(`${API_URL}/products?per_page=100`);
  expect(res.ok()).toBeTruthy();
  return (await res.json()).data;
}
