import { createLocalStore } from "./local-store";
import type { Session } from "./types";

function isSession(value: unknown): boolean {
  return value === null || (typeof value === "object" && "accessToken" in value && "user" in value);
}

export const sessionStore = createLocalStore<Session | null>("revoshop.session", null, isSession);
