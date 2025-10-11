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
  qty: number;
  option?: string;
  addons?: AddOn[];
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, option?: string) => void;
  updateQty: (id: string, option: string | undefined, delta: number) => void;
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
  updateQty: () => {},
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

  // ➕ Agregar al carrito (distinción por option)
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.option === item.option
      );

      if (existing) {
        // Incrementa cantidad si ya existe misma variante
        return prev.map((i) =>
          i.id === item.id && i.option === item.option
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }

      // Si es una variante nueva, agrega nuevo registro
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // 🔄 Actualizar cantidad por id + opción
  const updateQty = (id: string, option: string | undefined, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.option === option
            ? { ...i, qty: Math.max(1, i.qty + delta) }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  // ❌ Remover del carrito
  const removeFromCart = (id: string, option?: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.option === option))
    );
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

  // 💰 Subtotal con add-ons y qty
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const basePrice = item.price || 0;
      const addonsTotal =
        item.addons?.reduce((addonSum, a) => addonSum + a.price, 0) || 0;
      return sum + (basePrice + addonsTotal) * (item.qty || 1);
    }, 0);
  }, [cartItems]);

  // 💸 Total con descuento
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
        updateQty,
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
