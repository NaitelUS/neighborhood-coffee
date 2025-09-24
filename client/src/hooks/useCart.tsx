import { useState, useEffect } from "react";
import { coupons } from "../data/coupons";

export interface AddOn {
  name: string;
  price: number;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  addOns?: AddOn[];
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Load cart from localStorage
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

  // Save cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem(
      "current-order",
      JSON.stringify({ cartItems, discount, appliedCoupon })
    );
  }, [cartItems, discount, appliedCoupon]);

  const addItem = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.name === item.name);
      if (existing) {
        return prev.map((p) =>
          p.name === item.name
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (name: string) => {
    setCartItems((prev) => prev.filter((p) => p.name !== name));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (coupons[n]()
