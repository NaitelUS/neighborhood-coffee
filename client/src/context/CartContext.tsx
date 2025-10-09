import React, { createContext, useState, useEffect } from "react";

interface AddOn {
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  name: string;
  option?: string;
  price: number;
  addons?: AddOn[];
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, option?: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, option: string | undefined, qty: number) => void;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: string | null;
  setDiscount: React.Dispatch<React.SetStateAction<number>>;
  setAppliedCoupon: React.Dispatch<React.SetStateAction<string | null>>;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateQuantity: () => {},
  subtotal: 0,
  discount: 0,
  total: 0,
  appliedCoupon: null,
  setDiscount: () => {},
  setAppliedCoupon: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // 🧮 Subtotal seguro
  const subtotal = cart.reduce((sum, item) => {
    const basePrice = Number(item?.price ?? 0);
    const addonsTotal =
      item.addons?.reduce((a, b) => a + Number(b.price ?? 0), 0) || 0;
    return sum + (basePrice + addonsTotal) * (item?.quantity ?? 1);
  }, 0);

  // 🧾 Total
  const total = subtotal - subtotal * (discount ?? 0);

  // ➕ Agregar al carrito
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.option === item.option
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.option === item.option
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  // 🔄 Actualizar cantidad
  const updateQuantity = (
    id: string,
    option: string | undefined,
    qty: number
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.option === option
          ? { ...item, quantity: Math.max(qty, 1) }
          : item
      )
    );
  };

  // ❌ Quitar del carrito
  const removeFromCart = (id: string, option?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && item.option === option))
    );
  };

  // 🧹 Limpiar carrito
  const clearCart = () => setCart([]);

  // 💾 Persistencia local
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        subtotal,
        discount,
        total,
        appliedCoupon,
        setDiscount,
        setAppliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
