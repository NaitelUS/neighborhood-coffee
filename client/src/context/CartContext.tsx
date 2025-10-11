import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext<any>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // -----------------------------
  // 🧮 Estados principales
  // -----------------------------
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // -----------------------------
  // 🧾 Control de versión (para limpiar carrito en cada deploy)
  // -----------------------------
  useEffect(() => {
    const currentVersion = "v2.0.1"; // 🔁 actualiza este número en cada deploy
    const savedVersion = localStorage.getItem("cartVersion");

    if (savedVersion !== currentVersion) {
      console.log("🧹 Clearing old cart from previous version");
      localStorage.removeItem("cartItems");
      localStorage.setItem("cartVersion", currentVersion);
    }

    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    }
  }, []);

  // -----------------------------
  // 💾 Guardar carrito en localStorage cada vez que cambie
  // -----------------------------
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // -----------------------------
  // 🧮 Recalcular subtotal y total dinámicamente
  // -----------------------------
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => {
      const addonsTotal = (item.addons || []).reduce(
        (s: number, a: any) => s + (a.price || 0),
        0
      );
      return sum + (item.price + addonsTotal) * (item.qty || 1);
    }, 0);

    setSubtotal(newSubtotal);

    // total con descuento si hay cupón aplicado
    const newTotal = appliedCoupon ? newSubtotal * (1 - discount) : newSubtotal;
    setTotal(newTotal);
  }, [cartItems, discount, appliedCoupon]);

  // -----------------------------
  // 🛒 Funciones del carrito
  // -----------------------------

  // Agregar producto
  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (p) =>
          p.name === product.name &&
          p.option === product.option &&
          JSON.stringify(p.addons) === JSON.stringify(product.addons)
      );

    // si ya existe, solo aumenta cantidad
      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, qty: (p.qty || 1) + 1 } : p
        );
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
  };

  // Remover producto
  const removeFromCart = (item: any) => {
    setCartItems((prev) =>
      prev.filter(
        (p) =>
          !(
            p.name === item.name &&
            p.option === item.option &&
            JSON.stringify(p.addons) === JSON.stringify(item.addons)
          )
      )
    );
  };

  // Actualizar cantidad
  const updateQty = (item: any, newQty: number) => {
    setCartItems((prev) =>
      prev.map((p) =>
        p.name === item.name &&
        p.option === item.option &&
        JSON.stringify(p.addons) === JSON.stringify(item.addons)
          ? { ...p, qty: newQty }
          : p
      )
    );
  };

  // Vaciar carrito (para ThankYou o cancelaciones)
  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setDiscount(0);
    localStorage.removeItem("cartItems");
  };

  // -----------------------------
  // 🔗 Exportar todo el contexto
  // -----------------------------
  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        total,
        appliedCoupon,
        discount,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        setAppliedCoupon,
        setDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
