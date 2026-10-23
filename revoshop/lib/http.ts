import type { ApiResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local.");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, init);
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    // { error } or { msg }
    const message = body?.error ?? body?.msg ?? `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return body as ApiResponse<T>;
}
