import { useState, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  option?: string;
  quantity: number;
  addOns?: string[];
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => [...prev, item]);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return { cart, addToCart, removeFromCart, clearCart };
}
