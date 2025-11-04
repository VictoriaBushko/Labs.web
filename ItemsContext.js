import { createContext, useContext, useMemo, useState } from "react";
import { products as seed } from "../data/products";

const ItemsContext = createContext(null);

export function ItemsProvider({ children }) {
  const [items, setItems] = useState(seed);

  const api = useMemo(
    () => ({
      items,
      setItems,
      getById: (id) => items.find((x) => String(x.id) === String(id)),
    }),
    [items]
  );

  return <ItemsContext.Provider value={api}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error("useItems must be used inside <ItemsProvider>");
  return ctx;
}
