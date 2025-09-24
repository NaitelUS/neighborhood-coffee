import { useState, useEffect } from "react";
import { coupons } from "@/data/coupons";

const STORAGE_KEY = "current-order";

export function useCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Inicializar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar ítem al carrito
  const addItem = (item: any) => {
    setCartItems((prev) => [...prev, item]);
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setAppliedCoupon(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Aplicar cupón
  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (coupons[normalized]) {
      const subtotalCalc = cartItems.reduce(
        (acc, item) =>
          acc +
          ((item.price ?? 0) * item.quantity) +
          ((item.addOns?.reduce((a, add) => a + (add.price ?? 0), 0) || 0) *
            item.quantity),
        0
      );
      setDiscount(subtotalCalc * coupons[normalized]);
      setAppliedCoupon(normalized);
    } else {
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  // Calcular totales
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      ((item.price ?? 0) * item.quantity) +
      ((item.addOns?.reduce((a, add) => a + (add.price ?? 0), 0) || 0) *
        item.quantity),
    0
  );
  const total = subtotal - (discount ?? 0);

  // Submit order
  const submitOrder = (customer: any) => {
    const orderId = Math.floor(Math.random() * 100000).toString();
    const order = {
      id: orderId,
      customer,
      items: cartItems,
      subtotal,
      discount,
      total,
      createdAt: new Date().toISOString(),
    };

    console.log("Order submitted:", order);

    clearCart();

    // Redirigir a página Thank You
    window.location.href = `/thank-you/${orderId}`;
  };

  return {
    cartItems,
    addItem,
    clearCart,
    subtotal,
    discount,
    total,
    applyCoupon,
    submitOrder,
  };
}
