import React, { createContext, useState, useMemo } from "react";

// 🧱 Tipos
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
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
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
  clearCart: () => {},
  discount: 0,
  applyDiscount: () => {},
  subtotal: 0,
  total: 0,
});

// 🧠 Proveedor global del carrito
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();

  // ➕ Agregar producto al carrito
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  // 🗑️ Quitar producto
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔄 Vaciar carrito
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

  // 💰 Calcular subtotal (ya incluye Add-ons porque se suman en MenuItem)
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  }, [cartItems]);

  // 💸 Calcular total con descuento aplicado
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
