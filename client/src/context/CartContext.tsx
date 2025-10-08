import React, { createContext, useState, useEffect } from "react";

interface AddOn {
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  name: string;
  option?: string;
  addons: AddOn[];
  price: number;
  qty: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, option?: string) => void;
  updateQty: (id: string, change: number, option?: string) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string, discount: number) => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  clearCart: () => {},
  subtotal: 0,
  discount: 0,
  total: 0,
  appliedCoupon: null,
  applyCoupon: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountRate, setDiscountRate] = useState(0);

  // ✅ Add to cart — maneja qty y variantes (Hot/Iced)
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.option === item.option
      );

      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.option === item.option
            ? { ...i, qty: i.qty + item.qty }
            : i
        );
      } else {
        return [...prev, { ...item, qty: item.qty || 1 }];
      }
    });
  };

  // ✅ Remove specific item (Hot/Iced independiente)
  const removeFromCart = (id: string, option?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (i) => !(i.id === id && (!option || i.option === option))
      )
    );
  };

  // ✅ Update quantity
  const updateQty = (id: string, change: number, option?: string) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === id && (!option || i.option === option)
            ? { ...i, qty: Math.max(1, i.qty + change) }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  // ✅ Limpiar carrito
  const clearCart = () => setCartItems([]);

  // ✅ Cálculos de totales
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.price +
        item.addons.reduce((a, b) => a + (b.price || 0), 0)) *
        item.qty,
    0
  );

  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  // ✅ Aplicar cupón
  const applyCoupon = (code: string, rate: number) => {
    setAppliedCoupon(code);
    setDiscountRate(rate);
  };

  // 🧠 Persistencia (opcional)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
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
