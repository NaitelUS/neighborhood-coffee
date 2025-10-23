import React, { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // 🚀 Añadir producto al carrito
  const addToCart = (item: any) => {
    const existingIndex = cartItems.findIndex(
      (p) =>
        p.name === item.name &&
        p.option === item.option &&
        JSON.stringify(p.addons) === JSON.stringify(item.addons)
    );

    if (existingIndex !== -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingIndex].qty =
        (updatedItems[existingIndex].qty || 1) + (item.qty || 1);
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, { ...item, qty: item.qty || 1 }]);
    }
  };

  // ❌ Quitar item
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

  // 🔄 Actualizar cantidad
  const updateQty = (item: any, newQty: number) => {
