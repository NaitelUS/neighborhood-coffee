import { useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  basePrice: number;
  addOns: { id: string; name: string; price: number }[];
  temperature?: "hot" | "iced";
  option?: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("current-order");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing saved cart:", err);
        setCartItems([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("current-order", JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito
  const addItem = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (p) =>
          p.id === item.id &&
          p.temperature === item.temperature &&
          p.option === item.option &&
          JSON.stringify(p.addOns) === JSON.stringify(item.addOns)
      );

      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      } else {
        return [...prev, item];
      }
    });
  };

  // Remover item individual
  const removeItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Vaciar carrito completo
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("current-order");
  };

  // Calcular totales
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.basePrice +
        item.addOns.reduce((sum, a) => sum + a.price, 0)) *
        item.quantity,
    0
  );

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cartItems,
    addItem,
    removeItem,
    clearCart,
    subtotal,
    totalItems,
  };
}
