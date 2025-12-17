import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { productsAPI } from "../api/apiService";
import { products as backupProducts } from "../data/products";

const ItemsContext = createContext(null);

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getProducts();
        setItems(response.data);
      } catch (err) {
        setError('Помилка завантаження товарів з сервера. Використовуються локальні дані.');
        console.error('Error fetching items from API:', err);
        setItems(backupProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const api = useMemo(
    () => ({
      items,
      setItems,
      loading,
      error,
      getById: (id) => {
        const itemFromState = items.find((x) => String(x.id) === String(id));
        if (itemFromState) return itemFromState;
        
        const itemFromBackup = backupProducts.find((x) => String(x.id) === String(id));
        return itemFromBackup || null;
      },
      getFiltered: async (filters = {}) => {
        try {
          console.log(' Відправляю фільтри до API:', filters);
          const response = await productsAPI.getProducts(filters);
          console.log(' Отримав від API:', response.data);
          return response.data;
        } catch (err) {
          console.error(' Помилка API, використовую локальні дані:', err);
          return filterBackupProducts(filters);
        }
      },
      refreshItems: async () => {
        try {
          setLoading(true);
          const response = await productsAPI.getProducts();
          setItems(response.data);
          setError(null);
        } catch (err) {
          setError('Помилка оновлення товарів');
          console.error('Error refreshing items:', err);
        } finally {
          setLoading(false);
        }
      }
    }),
    [items, loading, error]
  );

  return <ItemsContext.Provider value={api}>{children}</ItemsContext.Provider>;
}

function filterBackupProducts(filters = {}) {
  let filtered = [...backupProducts];

  if (filters.type && filters.type !== 'any') {
    filtered = filtered.filter(p => p.type === filters.type);
  }

  if (filters.carat && filters.carat !== 'any') {
    switch (filters.carat) {
      case '0-1':
        filtered = filtered.filter(p => p.carat >= 0 && p.carat < 1);
        break;
      case '1-2':
        filtered = filtered.filter(p => p.carat >= 1 && p.carat < 2);
        break;
      case '2-3':
        filtered = filtered.filter(p => p.carat >= 2 && p.carat < 3);
        break;
      case '3+':
        filtered = filtered.filter(p => p.carat >= 3);
        break;
    }
  }

  if (filters.price && filters.price !== 'any') {
    switch (filters.price) {
      case '0-5000':
        filtered = filtered.filter(p => p.price >= 0 && p.price < 5000);
        break;
      case '5000-9000':
        filtered = filtered.filter(p => p.price >= 5000 && p.price < 9000);
        break;
      case '9000+':
        filtered = filtered.filter(p => p.price >= 9000);
        break;
    }
  }

  return filtered;
}

export function useItems() {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error("useItems must be used inside <ItemsProvider>");
  return ctx;
}