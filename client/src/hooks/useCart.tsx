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
    if (Array.isArray(parsed)) return { items: parsed };              // formato viejo
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

  // sync entre pestañas
  useEffect(() => {
    const onStorage = () => setItems(readCurrentOrder().items);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // persistir
  useEffect(() => {
    writeCurrentOrder(items);
  }, [items]);

  const addItem = (item: CartItem) => {
    // Normaliza addOns
    const safeItem: CartItem = {
      ...item,
      addOns: Array.isArray(item.addOns) ? item.addOns : [],
      quantity: Number(item.quantity || 1),
      basePrice: Number(item.basePrice || 0),
    };

    setItems((prev) => {
      const idx = prev.findIndex(
        (p) =>
          p.id === safeItem.id &&
          p.temperature === safeItem.temperature &&
          p.option === safeItem.option &&
          JSON.stringify(p.addOns) === JSON.stringify(safeItem.addOns)
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + safeItem.quantity };
        return next;
      }
      return [...prev, safeItem];
    });
  };

  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("current-order");
  };

  const subtotal = items.reduce(
    (acc, it) =>
      acc +
      (Number(it.basePrice || 0) + it.addOns.reduce((s, a) => s + Number(a.price || 0), 0)) *
        Number(it.quantity || 0),
    0
  );

  const totalItems = items.reduce((acc, it) => acc + Number(it.quantity || 0), 0);

  return { items, addItem, removeItem, clearCart, subtotal, totalItems };
}
