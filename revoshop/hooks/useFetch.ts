import { useEffect, useEffectEvent, useLayoutEffect, useState } from "react";
import { errorMessage } from "@/lib/http";

interface FetchResult<T> {
  key: string;
  data?: T;
  error?: string;
}

// Refetch on key change
export function useFetch<T>(key: string, load: () => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<FetchResult<T> | null>(null);
  const runLoad = useEffectEvent(load);
  const currentKey = `${key}#${attempt}`;

  useEffect(() => {
    let active = true;
    runLoad().then(
      (data) => active && setResult({ key: currentKey, data }),
      (error) => active && setResult({ key: currentKey, error: errorMessage(error) }),
    );
    return () => {
      active = false;
    };
  }, [currentKey]);

  // Fresh data on return
  useLayoutEffect(() => () => setResult(null), []);

  const current = result?.key === currentKey ? result : null;

  return {
    data: current?.data,
    error: current?.error,
    loading: current === null,
    reload: () => setAttempt((count) => count + 1),
  };
}
