import React, { createContext, useContext, useReducer } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  option?: string;
  addons?: any[];
}

interface CartState {
  items: CartItem[];
  couponCode?: string;
  discount?: number;
}

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: any): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "APPLY_COUPON":
      return {
        ...state,
        couponCode: action.payload.code,
        discount: action.payload.discount,
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    couponCode: undefined,
    discount: 0,
  });

  const addItem = (item: CartItem) => {
    if (!item || !item.id) return;
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const applyCoupon = (code: string, discount: number) =>
    dispatch({ type: "APPLY_COUPON", payload: { code, discount } });

  const getTotal = () => {
    const list = Array.isArray(state.items) ? state.items : [];
    const subtotal = list.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const discountAmount = subtotal * (state.discount || 0);
    return subtotal - discountAmount;
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        clearCart,
        applyCoupon,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    console.warn("⚠️ useCart() used outside of <CartProvider>");
    return {
      items: [],
      addItem: () => {},
      removeItem: () => {},
      clearCart: () => {},
      applyCoupon: () => {},
      getTotal: () => 0,
    };
  }
  return ctx;
}
