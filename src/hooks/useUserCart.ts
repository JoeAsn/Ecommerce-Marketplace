import { useCallback, useEffect, useRef, useState } from "react";
import { getCartForUser, updateCart } from "../api/cartAPI";
import type { CartItem } from "../types/cart";
import type { User } from "../types/user";

type CartApiItem = Partial<CartItem> & {
  productId?: number;
  size?: string;
  selectedSize?: string;
};

function normalizeCartItems(items: CartApiItem[] | null | undefined): CartItem[] {
  if (!Array.isArray(items)) return [];

  return items.map(({ productId, size, ...item }) => ({
    ...item,
    id: item.id ?? productId ?? 0,
    name: item.name ?? "",
    price: Number(item.price) || 0,
    mainImage: item.mainImage ?? "",
    selectedSize: item.selectedSize ?? size ?? "",
    quantity: Number(item.quantity) || 0,
  }));
}

export function useUserCart(user: User | null | undefined) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const cartIdRef = useRef<string | null>(null);
  const activeUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const userId = user?.id;
    activeUserIdRef.current = userId || null;
    cartIdRef.current = null;

    // Guests use only local state. No cart API request is made without a user ID.
    if (!userId) return undefined;

    let cancelled = false;
    getCartForUser(userId)
      .then((userCart) => {
        if (cancelled || activeUserIdRef.current !== userId || !userCart)
          return;
        cartIdRef.current = userCart.id;
        setCart(normalizeCartItems(userCart.items));
      })
      .catch((error) => console.error("Unable to load user cart:", error));

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const updateUserCart = useCallback(
    (nextCart: CartItem[] | ((currentCart: CartItem[]) => CartItem[])) => {
      setCart((currentCart) => {
        const resolvedCart =
          typeof nextCart === "function" ? nextCart(currentCart) : nextCart;
        const safeCart = Array.isArray(resolvedCart) ? resolvedCart : [];
        const userId = activeUserIdRef.current;
        const cartId = cartIdRef.current;

        // A guest, or a user whose cart has not been loaded, never triggers a PUT.
        if (userId && cartId) {
          updateCart(cartId, userId, safeCart).catch((error) =>
            console.error("Unable to save user cart:", error),
          );
        }

        return safeCart;
      });
    },
    [],
  );

  return { cart, updateCart: updateUserCart };
}
