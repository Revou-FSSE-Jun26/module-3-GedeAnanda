"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

const SEARCH_DELAY_MS = 350;

export interface CatalogContextValue {
  query: string;
  categoryId: number | null;
  isPending: boolean;
  isOnCatalog: boolean;
  setQuery: (value: string) => void;
  submitSearch: () => void;
  selectCategory: (categoryId: number | null) => void;
  clearFilters: () => void;
  syncFromUrl: (search: string, categoryId: number | null) => void;
  leaveCatalog: () => void;
}

export const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [urlCategory, setUrlCategory] = useState<number | null>(null);
  const [categoryId, setOptimisticCategory] = useOptimistic(urlCategory);
  const [isOnCatalog, setIsOnCatalog] = useState(false);
  // Our last push
  const lastPushed = useRef<string | null>(null);

  const navigate = useCallback(
    (search: string, category: number | null, fromCatalog: boolean, replace = false) => {
      lastPushed.current = search;
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", String(category));
      const queryString = params.toString();
      const href = queryString ? `/products?${queryString}` : "/products";

      startTransition(() => {
        setOptimisticCategory(category);
        if (replace) router.replace(href, { scroll: !fromCatalog });
        else router.push(href, { scroll: !fromCatalog });
      });
    },
    [router, setOptimisticCategory],
  );

  // Debounced, any page
  const pushTypedSearch = useEffectEvent(() => {
    const search = query.trim();
    if (search === lastPushed.current) return;
    if (!isOnCatalog && !search) return;
    // One history entry
    const replace = isOnCatalog || lastPushed.current !== null;
    navigate(search, isOnCatalog ? categoryId : null, isOnCatalog, replace);
  });

  useEffect(() => {
    const timer = setTimeout(pushTypedSearch, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const syncFromUrl = useCallback((search: string, category: number | null) => {
    setIsOnCatalog(true);
    setUrlCategory(category);
    if (search !== lastPushed.current) {
      lastPushed.current = search;
      setQuery(search);
    }
  }, []);

  const leaveCatalog = useCallback(() => {
    setIsOnCatalog(false);
    lastPushed.current = null;
    setQuery("");
  }, []);

  const value = useMemo<CatalogContextValue>(
    () => ({
      query,
      categoryId,
      isPending,
      isOnCatalog,
      setQuery,
      submitSearch: () => {
        const search = query.trim();
        if (isOnCatalog && search === lastPushed.current) return;
        navigate(search, isOnCatalog ? categoryId : null, isOnCatalog);
      },
      selectCategory: (category) => navigate(query.trim(), category, isOnCatalog),
      clearFilters: () => {
        setQuery("");
        navigate("", null, isOnCatalog);
      },
      syncFromUrl,
      leaveCatalog,
    }),
    [query, categoryId, isPending, isOnCatalog, navigate, syncFromUrl, leaveCatalog],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
