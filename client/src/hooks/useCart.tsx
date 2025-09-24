// client/src/hooks/useCart.ts
import { useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  option?: string; // Hot / Iced, Apple / Pineapple, etc.
  addOns?: string[]; // IDs de add-ons seleccionados
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("current-order");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing cart from localStorage:", e);
      return [];
    }
  });

  // Sync cart con localStorage
  useEffect(() => {
    localStorage.setItem("current-order", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.option === item.option
      );

      if (existingIndex !== -1) {
        // Si ya existe, actualiza cantidad
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        updated[existingIndex].addOns = [
          ...(updated[existingIndex].addOns || []),
          ...(item.addOns || []),
        ];
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart: cart ?? [], // siempre un array seguro
    addToCart,
    removeFromCart,
    clearCart,
  };
}
