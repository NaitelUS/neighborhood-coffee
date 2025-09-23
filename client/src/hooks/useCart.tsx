import { useEffect, useState } from "react";

export function useCart() {
  const [items, setItems] = useState<any[]>([]);

  // Load items from localStorage
  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("current-order") || "null");
    if (savedOrder?.items) {
      setItems(savedOrder.items);
    }
  }, []);

  // Listen for changes in localStorage (cross-tab sync)
  useEffect(() => {
    const handler = () => {
      const savedOrder = JSON.parse(localStorage.getItem("current-order") || "null");
      if (savedOrder?.items) {
        setItems(savedOrder.items);
      } else {
        setItems([]);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Helpers
  const addItem = (item: any) => {
    const newItems = [...items, item];
    setItems(newItems);
    localStorage.setItem("current-order", JSON.stringify({ items: newItems }));
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    localStorage.setItem("current-order", JSON.stringify({ items: newItems }));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("current-order");
  };

  const totalItems = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    totalItems,
  };
}
