import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext<any>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // 🧾 Limpieza automática del carrito en nuevos deploys
  useEffect(() => {
    const currentVersion = "v2.0.2"; // ⬅️ cambia cada vez que hagas deploy
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

  // 💾 Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 🧮 Calcular subtotal y total con precisión
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => {
      const basePrice = item.basePrice ?? item.price;
      const qty = item.qty || 1;

      const addonsTotal = (item.addons || []).reduce(
        (acc: number, addon: any) => acc + (addon.price || 0),
        0
      );

      const totalItemPrice = (basePrice + addonsTotal) * qty;

      return sum + totalItemPrice;
    }, 0);

    setSubtotal(newSubtotal);

    const newTotal = appliedCoupon
      ? newSubtotal * (1 - discount)
      : newSubtotal;

    setTotal(newTotal);
  }, [cartItems, discount, appliedCoupon]);

  // -------------------------------
  // 🛒 Funciones principales
  // -------------------------------

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (p) =>
          p.name === product.name &&
          p.option === product.option &&
          JSON.stringify(p.addons) === JSON.stringify(product.addons)
      );

      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, qty: (p.qty || 1) + 1 } : p
        );
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
  };

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

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setDiscount(0);
    localStorage.removeItem("cartItems");
  };

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
