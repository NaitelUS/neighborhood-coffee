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

  // ✅ Agregar producto al carrito (maneja repetidos Hot/Iced sin NaN)
  const addToCart = (item: CartItem) => {
    const safePrice = Number(item.price) || 0;
    const safeQty = Number(item.qty) > 0 ? Number(item.qty) : 1;

    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.option === item.option
      );

      if (existing) {
        // ✅ Sumar cantidad sin riesgo de NaN
        const newQty = Math.max(1, (Number(existing.qty) || 1) + safeQty);
        return prev.map((i) =>
          i.id === item.id && i.option === item.option
            ? { ...i, qty: newQty }
            : i
        );
      } else {
        // ✅ Normalizar todos los valores nuevos
        return [
          ...prev,
          {
            ...item,
            qty: safeQty,
            price: safePrice,
            addons:
              item.addons?.map((a) => ({
                name: a.name,
                price: Number(a.price) || 0,
              })) || [],
          },
        ];
      }
    });
  };

  // ✅ Eliminar producto
  const removeFromCart = (id: string, option?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (i) => !(i.id === id && (!option || i.option === option))
      )
    );
  };

  // ✅ Actualizar cantidad con control de NaN y mínimo 1
  const updateQty = (id: string, change: number, option?: string) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id && (!option || i.option === option)) {
            const newQty = Math.max(1, (Number(i.qty) || 1) + change);
            return { ...i, qty: newQty };
          }
          return i;
        })
        .filter((i) => (Number(i.qty) || 1) > 0)
    );
  };

  // ✅ Limpiar carrito
  const clearCart = () => setCartItems([]);

  // ✅ Calcular totales sin riesgo de NaN
  const subtotal = cartItems.reduce((sum, item) => {
    const base = Number(item.price) || 0;
    const addonsTotal = (item.addons || []).reduce(
      (a, b) => a + (Number(b.price) || 0),
      0
    );
    const qty = Number(item.qty) > 0 ? Number(item.qty) : 1;
    return sum + (base + addonsTotal) * qty;
  }, 0);

  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  // ✅ Aplicar cupón
  const applyCoupon = (code: string, rate: number) => {
    setAppliedCoupon(code);
    setDiscountRate(rate);
  };

  // 🧠 Guardar carrito en localStorage
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
