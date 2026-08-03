import type { Dispatch, SetStateAction } from "react";
import type { Product } from "./products";

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  productId: number;
  quantity: number;
  size?: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}

export interface CartItem
  extends Pick<Product, "id" | "name" | "price" | "mainImage" | "selectedSize"> {
  quantity: number;
  details?: string;
}

export interface CartStateProps {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}