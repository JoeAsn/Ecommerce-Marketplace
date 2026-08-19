/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import { getOrdersForUser } from "./api/ordersAPI";
import type { Product } from "./types/products";
import type { Order } from "./types/orders";
import type { User } from "./types/user";

interface DataContextValue {
  products: Product[];
  loading: boolean;
  user: User | null;
  setUser: (nextUser: User | null | undefined) => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  ordersLoading: boolean;
}

export const DataContext = createContext<DataContextValue | null>(null);
const apiUrl: string = import.meta.env.VITE_PRODUCTS_API_URL;

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const setAuthenticatedUser = useCallback((nextUser: User | null | undefined) => {
    setOrders([]);
    setOrdersLoading(Boolean(nextUser?.id));
    setUser(nextUser ?? null);
  }, []);
  useEffect(() => {
    axios
      .get(apiUrl)
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return undefined;
    }

    let cancelled = false;
    getOrdersForUser(user.id)
      .then((userOrders) => {
        if (!cancelled) setOrders(userOrders);
      })
      .catch((error) => console.error("Unable to load user orders:", error))
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return (
    <DataContext.Provider value={{
      products,
      loading,
      user,
      setUser: setAuthenticatedUser,
      orders,
      setOrders,
      ordersLoading,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
}
