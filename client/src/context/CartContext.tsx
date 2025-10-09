import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AddOn {
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  name: string;
  option?: string;
  price: number;
  quantity: number;
  addons?: AddOn[];
}

interface CartContextType {
  cartItems: CartItem[];
  subtotal: number;
  discountRate: number;
  total: number;
  appliedCoupon: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDiscountRate: (rate: number) => void;
  setAppliedCoupon: (coupon: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ✅ Hook personalizado para acceder al contexto
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountRate, setDiscountRate] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.price +
        (item.addons?.reduce((a, b) => a + b.price, 0) || 0)) *
        item.quantity,
    0
  );

  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  const addItem = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.name === newItem.name &&
          item.option === newItem.option &&
          JSON.stringify(item.addons) === JSON.stringify(newItem.addons)
      );
      if (existing) {
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prev, newItem];
      }
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscountRate(0);
    setAppliedCoupon(null);
  };

  useEffect(() => {
    console.log("🛒 Cart updated:", cartItems);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        discountRate,
        total,
        appliedCoupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setDiscountRate,
        setAppliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
