import React, { createContext, useContext, useMemo, useState } from "react";

export interface AddOn { name: string; price: number }
export interface CartItem {
  id: string;
  name: string;
  price: number;
  option?: string;
  addons?: AddOn[];
  quantity: number;
}

interface CartContextShape {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;

  // Totales y cupón
  subtotal: number;
  discountRate: number;      // ej. 0.15
  discount: number;          // dinero
  total: number;
  appliedCoupon: string | null;
  setDiscountRate: (r: number) => void;
  setAppliedCoupon: (c: string | null) => void;
}

export const CartContext = createContext<CartContextShape | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountRate, setDiscountRate] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const addItem = (item: CartItem) => {
    setCartItems(prev => {
      const match = prev.find(
        p => p.name === item.name &&
             p.option === item.option &&
             JSON.stringify(p.addons||[]) === JSON.stringify(item.addons||[])
      );
      if (match) {
        return prev.map(p => p === match ? { ...p, quantity: p.quantity + item.quantity } : p);
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => setCartItems(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, qty: number) =>
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  const clearCart = () => { setCartItems([]); setDiscountRate(0); setAppliedCoupon(null); };

  const subtotal = useMemo(() => {
    return (cartItems || []).reduce((sum, i) => {
      const addons = (i.addons || []).reduce((a, b) => a + b.price, 0);
      return sum + (i.price + addons) * i.quantity;
    }, 0);
  }, [cartItems]);

  const discount = useMemo(() => subtotal * discountRate, [subtotal, discountRate]);
  const total = useMemo(() => subtotal - discount, [subtotal, discount]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discountRate,
        discount,
        total,
        appliedCoupon,
        setDiscountRate,
        setAppliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartUnsafe = () => useContext(CartContext);
