import { useContext } from "react";
import { CatalogContext, type CatalogContextValue } from "@/context/CatalogContext";

export function useCatalog(): CatalogContextValue {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return context;
}
