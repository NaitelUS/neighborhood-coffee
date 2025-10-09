import React, { createContext, useContext, useReducer } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  option?: string;
  addons?: { name: string; price: number }[];
}

interface CartState {
  items: CartItem[];
  couponCode?: string;
  discountRate?: number;
}

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, rate: number) => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

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
        discountRate: action.payload.rate,
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const initialState: CartState = {
    items: [],
    couponCode: undefined,
    discountRate: 0,
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: CartItem) => {
    if (!item || !item.id) return;
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const applyCoupon = (code: string, rate: number) =>
    dispatch({ type: "APPLY_COUPON", payload: { code, rate } });

  const getSubtotal = () => {
    if (!Array.isArray(state.items)) return 0;
    return state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = subtotal * (state.discountRate || 0);
    return subtotal - discount;
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        clearCart,
        applyCoupon,
        getSubtotal,
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
    console.error("❌ useCart() used outside of <CartProvider>");
    return {
      items: [],
      addItem: () => {},
      removeItem: () => {},
      clearCart: () => {},
      applyCoupon: () => {},
      getSubtotal: () => 0,
      getTotal: () => 0,
    } as CartContextType;
  }
  return ctx;
}
