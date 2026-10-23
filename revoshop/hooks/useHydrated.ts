import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False on server
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
