import { useEffect, useState } from "react";

export function useCart() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const currentOrder = JSON.parse(localStorage.getItem("current-order") || "null");
      if (currentOrder?.items) {
        const count = currentOrder.items.reduce(
          (sum: number, item: any) => sum + (item.quantity || 0),
          0
        );
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    };

    updateCount();

    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  return { cartCount };
}
