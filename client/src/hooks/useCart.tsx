import { useState, useEffect } from "react";
import { coupons } from "@/data/coupons";

export interface CartItem {
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
  addOns?: { name: string; price: number }[];
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // 🔄 Cargar carrito desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("current-order");
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  // 💾 Guardar cambios en localStorage y recalcular totales
  useEffect(() => {
    localStorage.setItem("current-order", JSON.stringify(cartItems));
    calculateTotals();
  }, [cartItems]);

  // 📊 Calcular subtotal, descuento y total
  const calculateTotals = () => {
    const sub = cartItems.reduce((acc, item) => {
      const base = (item.price ?? 0) * (item.quantity ?? 1);
      const addOnTotal =
        item.addOns?.reduce((a, o) => a + (o.price ?? 0), 0) ?? 0;
      return acc + base + addOnTotal;
    }, 0);

    setSubtotal(sub);
    setTotal(sub - discount);
  };

  // ➕ Agregar al carrito
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.name === item.name && i.variant === item.variant
      );
      if (existing) {
        return prev.map((i) =>
          i.name === item.name && i.variant === item.variant
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  // ➖ Remover del carrito
  const removeFromCart = (name: string, variant?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (i) => !(i.name === name && i.variant === variant)
      )
    );
  };

  // 🏷️ Aplicar cupón
  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (coupons[normalized]) {
      setDiscount(subtotal * coupons[normalized]);
    } else {
      setDiscount(0);
    }
  };

  // 🧹 Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
  };

  return {
    cartItems,
    subtotal,
    discount,
    total,
    addToCart,
    removeFromCart,
    applyCoupon,
    clearCart,
  };
}
