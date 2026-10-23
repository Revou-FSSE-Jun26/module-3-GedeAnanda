import { ApiError, request } from "./http";
import { sessionStore } from "./session";
import type { Session, User } from "./types";

// Browser only

const jsonHeaders = { "Content-Type": "application/json" };

interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export async function login(email: string, password: string): Promise<Session> {
  const res = await request<LoginResponse>("/auth/login", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, password }),
  });
  return { user: res.data.user, accessToken: res.data.access_token, refreshToken: res.data.refresh_token };
}

export async function register(username: string, email: string, password: string): Promise<User> {
  const res = await request<{ user: User }>("/auth/register", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ username, email, password }),
  });
  return res.data.user;
}

export async function logout(accessToken: string): Promise<void> {
  await request("/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } });
}

async function refreshAccessToken(session: Session): Promise<string | null> {
  try {
    const res = await request<{ access_token: string }>("/auth/refresh", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.refreshToken}` },
    });
    sessionStore.set({ ...session, accessToken: res.data.access_token });
    return res.data.access_token;
  } catch {
    sessionStore.set(null);
    return null;
  }
}

export async function authRequest<T>(path: string, method = "GET", body?: unknown) {
  const session = sessionStore.get();
  if (!session) throw new ApiError("Log in to continue.", 401);

  const send = (token: string) =>
    request<T>(path, {
      method,
      headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  try {
    return await send(session.accessToken);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    // Expired token
    const token = await refreshAccessToken(session);
    if (!token) throw new ApiError("Your session expired. Log in again.", 401);
    return send(token);
  }
}
