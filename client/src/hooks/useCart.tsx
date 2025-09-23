import { useEffect, useState } from "react";

export interface CartAddOn { id: string; name: string; price: number }
export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  basePrice: number;
  addOns: CartAddOn[];
  temperature?: "hot" | "iced";
  option?: string;
}

type CurrentOrder = { items: CartItem[] };

function readCurrentOrder(): CurrentOrder {
  try {
    const raw = localStorage.getItem("current-order");
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);

    // Acepta ambos formatos: array o { items: [...] }
    if (Array.isArray(parsed)) return { items: parsed };
    if (parsed && Array.isArray(parsed.items)) return { items: parsed.items };
    return { items: [] };
  } catch {
    return { items: [] };
  }
}

function writeCurrentOrder(items: CartItem[]) {
  localStorage.setItem("current-order", JSON.stringify({ items }));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => readCurrentOrder().items);

  // Sincroniza cuando cambie el storage (otra pestaña, etc.)
  useEffect(() => {
    const onStorage = () => setItems(readCurrentOrder().items);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persiste en storage cuando cambian los items
  useEffect(() => {
    writeCurrentOrder(items);
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const matchIdx = prev.findIndex(
        (p) =>
          p.id === item.id &&
          p.temperature === item.temperature &&
          p.option === item.option &&
          JSON.stringify(p.addOns) === JSON.stringify(item.addOns)
      );
      if (matchIdx >= 0) {
        const next = [...prev];
        next[matchIdx] = { ...next[matchIdx], quantity: next[matchIdx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("current-order");
  };

  const subtotal = items.reduce(
    (acc, it) => acc + (it.basePrice + it.addOns.reduce((s, a) => s + a.price, 0)) * it.quantity,
    0
  );
  const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);

  return { items, addItem, removeItem, clearCart, subtotal, totalItems };
}
