import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountRate, setDiscountRate] = useState<number>(0); // percent_off (e.g. 0.15)
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // 🧮 Calcular subtotal y total cada vez que cambie el carrito o el cupón
  useEffect(() => {
    const computedSubtotal = cartItems.reduce((sum, item) => {
      const base = Number(item.price) || 0;
      const addonsTotal = (item.addons || []).reduce(
        (a, b) => a + (Number(b.price) || 0),
        0
      );
      const qty = Number(item.qty) > 0 ? Number(item.qty) : 1;
      return sum + (base + addonsTotal) * qty;
    }, 0);

    const discountAmount = computedSubtotal * discountRate;
    const computedTotal = computedSubtotal - discountAmount;

    setSubtotal(Number.isFinite(computedSubtotal) ? computedSubtotal : 0);
    setTotal(Number.isFinite(computedTotal) ? computedTotal : 0);
  }, [cartItems, discountRate]);

  // 🧩 Agregar producto
  const addToCart = (product: any) => {
    setCartItems((prev) => {
      // Verificar si ya existe el mismo producto + opción
      const existing = prev.find(
        (item) => item.id === product.id && item.option === product.option
      );

      if (existing) {
        // Incrementar cantidad
        return prev.map((item) =>
          item.id === product.id && item.option === product.option
            ? { ...item, qty: item.qty + (product.qty || 1) }
            : item
        );
      }
      // Agregar nuevo producto
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  };

  // ➕ / ➖ actualizar cantidad
  const updateQty = (id: string, delta: number, option?: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.option === option
            ? { ...item, qty: Math.max(1, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // 🗑️ Eliminar producto
  const removeFromCart = (id: string, option?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.option === option)
      )
    );
  };

  // 🎟️ Aplicar cupón
  const applyDiscount = (code: string, rate: number) => {
    setAppliedCoupon(code);
    setDiscountRate(rate);
  };

  // ♻️ Limpiar carrito (por ejemplo, al completar una orden)
  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setDiscountRate(0);
    setSubtotal(0);
    setTotal(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        subtotal,
        total,
        discount: subtotal * discountRate,
        discountRate,
        appliedCoupon,
        applyDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
