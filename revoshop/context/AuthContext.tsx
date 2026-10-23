"use client";

import { createContext, useMemo, useSyncExternalStore } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import * as api from "@/lib/client-api";
import { sessionStore } from "@/lib/session";
import type { User } from "@/lib/types";

export interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

async function login(email: string, password: string): Promise<User> {
  const session = await api.login(email, password);
  sessionStore.set(session);
  return session.user;
}

async function register(username: string, email: string, password: string): Promise<User> {
  await api.register(username, email, password);
  // No token returned
  return login(email, password);
}

function logout() {
  const session = sessionStore.get();
  sessionStore.set(null);
  if (session) api.logout(session.accessToken).catch(() => {});
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(sessionStore.subscribe, sessionStore.get, sessionStore.getServerSnapshot);
  const ready = useHydrated();

  const value = useMemo<AuthContextValue>(
    () => ({ user: session?.user ?? null, ready, login, register, logout }),
    [session, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
