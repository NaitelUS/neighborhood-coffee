import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate subtotal
  useEffect(() => {
    const sum = cartItems.reduce((acc, item) => {
      const base = Number(item.basePrice ?? item.price ?? 0);
      const addonsTotal = Array.isArray(item.addons)
        ? item.addons.reduce((sum, a) => sum + Number(a.price || 0), 0)
        : 0;
      const qty = Number(item.qty || 1);
      return acc + (base + addonsTotal) * qty;
    }, 0);
    setSubtotal(sum);
  }, [cartItems]);

  // Calculate total
  useEffect(() => {
    let finalTotal = subtotal;
    if (discount > 0) finalTotal -= discount;
    setTotal(finalTotal > 0 ? finalTotal : 0);
  }, [subtotal, discount]);

  // Add to cart
  const addToCart = (product: any) => {
    setCartItems((prev) => [...prev, product]);
  };

  // Remove from cart
  const removeFromCart = (product: any) => {
    setCartItems((prev) => prev.filter((item) => item !== product));
  };

  // Clear cart (after order)
  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setDiscount(0);
    localStorage.removeItem("cartItems");
  };

  // 🟩 Apply coupon — compatible with /functions/checkCoupon.ts
  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch("/.netlify/functions/checkCoupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!data.success) {
        console.warn("Invalid coupon:", data.message);
        setAppliedCoupon(null);
        setDiscount(0);
        return { success: false };
      }

      // Determine discount type
      let discountValue = 0;
      if (data.type === "percent") {
        discountValue = subtotal * data.discount; // e.g. 0.1 = 10%
      } else if (data.type === "amount") {
        discountValue = data.discount;
      }

      // Clamp max discount
      if (discountValue > subtotal) discountValue = subtotal;

      setAppliedCoupon(code.toUpperCase());
      setDiscount(discountValue);
      return { success: true };
    } catch (err) {
      console.error("Coupon apply failed:", err);
      return { success: false };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        subtotal,
        discount,
        total,
        appliedCoupon,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
