import React, { createContext, useContext, useState, useMemo } from "react";

interface AddOn {
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  option?: string;
  addons?: AddOn[];
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  discountRate: number;
  total: number;
  appliedCoupon: string | null;
  setDiscountRate: (rate: number) => void;
  setAppliedCoupon: (coupon: string | null) => void;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountRate, setDiscountRate] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const addItem = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) => p.name === item.name && p.option === item.option
      );
      if (existing) {
        // Si ya existe, aumentar cantidad
        return prev.map((p) =>
          p.id === existing.id
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountRate(0);
    setAppliedCoupon(null);
  };

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          item.price * item.quantity +
          (item.addons?.reduce((a, b) => a + b.price, 0) || 0) * item.quantity,
        0
      ),
    [cart]
  );

  const total = useMemo(() => subtotal * (1 - discountRate), [subtotal, discountRate]);
  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clearCart,
        subtotal,
        discountRate,
        total,
        appliedCoupon,
        setDiscountRate,
        setAppliedCoupon,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Hook personalizado para acceder al carrito
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
