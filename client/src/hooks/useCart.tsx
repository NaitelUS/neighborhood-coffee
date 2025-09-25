import { useState, useEffect } from "react";

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
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("current-order");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("current-order", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("current-order", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("current-order", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("current-order");
  };

  return { cart, addToCart, removeFromCart, clearCart };
}
