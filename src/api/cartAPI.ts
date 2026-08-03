import axios from "axios";
import type { CartItem } from "../types/cart";

const CART_API_URL = import.meta.env.VITE_CART_API_URL;

export async function getCartForUser(userId : string) {
  if (!userId || !CART_API_URL) return null;

  const response = await axios.get(CART_API_URL, { params: { userId } });
  return response.data[0] || null;
}

export async function updateCart(cartId : string, userId : string, items: CartItem[]) {
  if (!cartId || !userId || !CART_API_URL) return;

  const total = items.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );

  await axios.put(`${CART_API_URL}/${cartId}`, {
    userId,
    items: items.map(({ id, selectedSize, ...item }) => ({
      ...item,
      productId: id,
      size: selectedSize,
    })),
    total,
  });
}
