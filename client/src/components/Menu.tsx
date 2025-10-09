import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Plus, Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  image?: string;
  option?: string;
}

export default function Menu() {
  const cart = useCart();
  const addItem = cart?.addItem || (() => console.warn("⚠️ Cart not ready"));

  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/.netlify/functions/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("⚠️ Error loading products:", err);
        setLoading(false);
      });
  }, []);

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      option: product.option || "",
      quantity,
      addons: [],
    });
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-10">☕ Loading menu...</div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        ⚠️ No products available right now.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center text-[#00454E]">
        The Neighborhood Coffee ☕
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Select your favorite drink and add it to your order.
      </p>

      <div className="grid gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-500">${p.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(p.id, -1)}
                className="p-1 border rounded-full w-7 h-7 flex items-center justify-center"
              >
                <Minus size={14} />
              </button>

              <span className="w-6 text-center text-sm font-medium">
                {quantities[p.id] || 1}
              </span>

              <button
                onClick={() => handleQuantityChange(p.id, 1)}
                className="p-1 border rounded-full w-7 h-7 flex items-center justify-center"
              >
                <Plus size={14} />
              </button>

              <button
                onClick={() => handleAddToCart(p)}
                className="ml-3 bg-[#00454E] text-white px-3 py-1 rounded-lg text-sm"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
