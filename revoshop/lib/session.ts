import { createLocalStore } from "./local-store";
import type { Session } from "./types";

export const sessionStore = createLocalStore<Session | null>("revoshop.session", null);
