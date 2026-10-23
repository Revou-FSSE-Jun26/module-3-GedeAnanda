// localStorage store for useSyncExternalStore
export function createLocalStore<T>(key: string, fallback: T) {
  const listeners = new Set<() => void>();
  let value = fallback;
  let loaded = false;

  function get(): T {
    if (!loaded) {
      loaded = true;
      try {
        const raw = localStorage.getItem(key);
        value = raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        value = fallback;
      }
    }
    return value;
  }

  function set(next: T) {
    value = next;
    loaded = true;
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage full
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    // Other tabs
    function onStorage(event: StorageEvent) {
      if (event.key !== key) return;
      loaded = false;
      listener();
    }
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  return { get, set, subscribe, getServerSnapshot: () => fallback };
}
