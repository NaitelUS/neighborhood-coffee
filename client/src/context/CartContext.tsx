import React, { createContext, useState, useMemo } from "react";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: any) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  // ✅ Agregar producto (NO suma los AddOns aquí)
  const addToCart = (product: any) => {
    const existing = cartItems.find(
      (item) =>
        item.name === product.name &&
        item.option === product.option &&
        JSON.stringify(item.addons) === JSON.stringify(product.addons)
    );

    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item === existing ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (product: any) => {
    setCartItems(
      cartItems.filter(
        (item) =>
          !(
            item.name === product.name &&
            item.option === product.option &&
            JSON.stringify(item.addons) === JSON.stringify(product.addons)
          )
      )
    );
  };

  const updateQty = (product: any, qty: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.name === product.name &&
        item.option === product.option &&
        JSON.stringify(item.addons) === JSON.stringify(product.addons)
          ? { ...item, qty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setDiscount(0);
  };

  // ✅ Subtotal calcula AddOns solo una vez
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const addonsTotal = item.addons
        ? item.addons.reduce(
            (addonSum: number, addon: any) => addonSum + (addon.price || 0),
            0
          )
        : 0;
      const itemTotal = (item.price + addonsTotal) * (item.qty || 1);
      return sum + itemTotal;
    }, 0);
  }, [cartItems]);

  // ✅ Total con descuento (solo una vez)
  const total = useMemo(() => subtotal * (1 - discount), [subtotal, discount]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    appliedCoupon,
    setAppliedCoupon,
    discount,
    setDiscount,
    subtotal,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
