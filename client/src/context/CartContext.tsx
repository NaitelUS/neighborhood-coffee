import React, { createContext, useState, useMemo } from "react";

// 🧩 Tipos
interface AddOn {
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number; // 💡 NUEVO
  option?: string;
  addons?: AddOn[];
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void; // 💡 NUEVO
  clearCart: () => void;
  discount: number;
  appliedCoupon?: string;
  applyDiscount: (couponCode: string, discountValue: number) => void;
  subtotal: number;
  total: number;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {}, // 💡 NUEVO
  clearCart: () => {},
  discount: 0,
  applyDiscount: () => {},
  subtotal: 0,
  total: 0,
});

// 💡 Provider global
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();

  // ➕ Agregar al carrito
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }]; // 💡 inicia con qty: 1
    });
  };

  // 💡 Actualizar cantidad
  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  // ❌ Remover del carrito
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🧹 Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setAppliedCoupon(undefined);
  };

  // 🏷️ Aplicar descuento
  const applyDiscount = (couponCode: string, discountValue: number) => {
    setDiscount(discountValue);
    setAppliedCoupon(couponCode);
  };

  // 💰 Subtotal con Add-ons y qty
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const basePrice = item.price || 0;
      const addonsTotal =
        item.addons?.reduce((addonSum, a) => addonSum + a.price, 0) || 0;
      return sum + (basePrice + addonsTotal) * (item.qty || 1);
    }, 0);
  }, [cartItems]);

  // 💸 Total con descuento aplicado
  const total = useMemo(() => {
    const discountAmount = subtotal * discount;
    return subtotal - discountAmount;
  }, [subtotal, discount]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty, // 💡 NUEVO
        clearCart,
        discount,
        appliedCoupon,
        applyDiscount,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
