import React, { createContext, useEffect, useMemo, useState } from "react";

type AddOn = { name: string; price: number };
type CartItem = {
  id: string;
  name: string;
  option?: string;
  price: number;      // precio base SIN add-ons
  addons?: AddOn[];   // [{name, price}]
  qty: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  updateQty: ((item: CartItem, newQty: number) => void) &
             ((id: string, option: string | undefined, delta: number) => void);
  removeFromCart: ((item: CartItem) => void) &
                  ((id: string, option?: string) => void);
  clearCart: () => void;
  appliedCoupon: string | null;
  setAppliedCoupon: (c: string | null) => void;
  discount: number; // 0..1
  setDiscount: (n: number) => void;
  subtotal: number;
  total: number;
};

export const CartContext = createContext<CartContextType>({} as any);

const addonsKey = (addons?: AddOn[]) =>
  JSON.stringify((addons || []).map(a => ({ n: a.name, p: a.price })));

const sameLine = (a: CartItem, b: Omit<CartItem,"qty">) =>
  a.name === b.name &&
  a.option === b.option &&
  addonsKey(a.addons) === addonsKey(b.addons);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("tnc.cart.v1");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem("tnc.cart.v1", JSON.stringify(cartItems));
  }, [cartItems]);

  // 👉 NO sumamos add-ons aquí; los sumamos una sola vez en subtotal.
  const addToCart = (product: Omit<CartItem, "qty">) => {
    const idx = cartItems.findIndex(ci => sameLine(ci, product));
    if (idx >= 0) {
      const next = [...cartItems];
      next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
      setCartItems(next);
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  // Firma 1: updateQty(item, newQty)
  const updateQtyByItem = (item: CartItem, newQty: number) => {
    const nextQty = Math.max(1, Math.floor(newQty || 1));
    setCartItems(prev =>
      prev.map(ci =>
        ci === item || sameLine(ci, item) ? { ...ci, qty: nextQty } : ci
      )
    );
  };
  // Firma 2: updateQty(id, option, delta)
  const updateQtyByKey = (id: string, option: string | undefined, delta: number) => {
    setCartItems(prev =>
      prev.map(ci =>
        ci.id === id && ci.option === option
          ? { ...ci, qty: Math.max(1, (ci.qty || 1) + (delta || 0)) }
          : ci
      )
    );
  };
  const updateQty: any = (a: any, b: any, c?: any) => {
    if (typeof a === "object") return updateQtyByItem(a, b);
    return updateQtyByKey(a, b, c);
  };

  // Firma 1: removeFromCart(item)
  const removeByItem = (item: CartItem) => {
    setCartItems(prev => prev.filter(ci => !(ci === item || sameLine(ci, item))));
  };
  // Firma 2: removeFromCart(id, option)
  const removeByKey = (id: string, option?: string) => {
    setCartItems(prev => prev.filter(ci => !(ci.id === id && ci.option === option)));
  };
  const removeFromCart: any = (a: any, b?: any) => {
    if (typeof a === "object") return removeByItem(a);
    return removeByKey(a, b);
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setDiscount(0);
  };

  // 💵 Subtotal: (precio base + add-ons) * qty — solo una vez
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const addonsTotal = (item.addons || []).reduce((s, a) => s + (a.price || 0), 0);
      return sum + (item.price + addonsTotal) * (item.qty || 1);
    }, 0);
  }, [cartItems]);

  const total = useMemo(() => subtotal * (1 - discount), [subtotal, discount]);

  const value: CartContextType = {
    cartItems,
    addToCart,
    updateQty,
    removeFromCart,
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
