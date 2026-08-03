import axios from "axios";
import type { Order } from "../types/orders";

const ORDERS_API_URL = import.meta.env.VITE_ORDERS_API_URL;

export async function getOrdersForUser(userId: string) {
  if (!userId || !ORDERS_API_URL) return [];

  const response = await axios.get(ORDERS_API_URL, { params: { userId } });
  return Array.isArray(response.data) ? response.data : [];
}

export async function createOrder(order: Order) {
  if (!ORDERS_API_URL) throw new Error("Orders API URL is not configured.");
  if (!order?.userId) throw new Error("You must be signed in to place an order.");

  const response = await axios.post(ORDERS_API_URL, order);
  return response.data;
}
