import { useState, useEffect } from "react";
import { coupons } from "../data/coupons";

export interface AddOn {
  name: string;
  price: number;
}

export interface CartItem {
  name: string;
  variant?: "Hot" | "Iced";
  price: number;
  quantity: number;
  addOns?: AddOn[];
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("current-order");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCartItems(parsed.cartItems || []);
        setDiscount(parsed.discount || 0);
        setAppliedCoupon(parsed.appliedCoupon || null);
      } catch (err) {
        console.error("Error parsing current-order:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "current-order",
      JSON.stringify({ cartItems, discount, appliedCoupon })
    );
  }, [cartItems, discount, appliedCoupon]);

  const addItem = (item: CartItem) => {
    setCartItems((prev) => {
      return [...prev, item];
    });
  };

  const removeItem = (name: string, variant?: "Hot" | "Iced") => {
    setCartItems((prev) =>
      prev.filter((p) => !(p.name === name && p.variant === variant))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (coupons[normalized]) {
      const subtotal = cartItems.reduce(
        (acc, item) =>
          acc +
          item.price * item.quantity +
          ((item.addOns?.reduce((a, add) => a + add.price, 0) || 0) *
            item.quantity),
        0
      );
      const newDiscount = subtotal * coupons[normalized];
      setDiscount(newDiscount);
      setAppliedCoupon(normalized);
    } else {
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  return {
    cartItems,
    addItem,
    removeItem,
    clearCart,
    discount,
    appliedCoupon,
    applyCoupon,
  };
};
