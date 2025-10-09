import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Plus, Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  option?: string;
  description?: string;
  image?: string;
}

export default function Menu() {
  const cart = useContext(CartContext);
  const addItem = cart?.addItem || (() => {});
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/.netlify/functions/products")
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => console.error("Products error:", err));
  }, []);

  const changeQty = (id: string, d: number) =>
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + d) }));

  const handleAdd = (p: Product) => {
    const qty = quantities[p.id] || 1;
    addItem({
      id: `${p.id}-${Date.now()}`,
      name: p.name,
      price: p.price,
      option: p.option || "",
      quantity: qty,
      addons: [],
    });
  };

  if (!Array.isArray(products)) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center text-[#00454E]">The Neighborhood Coffee ☕</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-400">Loading menu...</p>
      ) : (
        <div className="grid gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white shadow rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-500">${p.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => changeQty(p.id, -1)} className="border rounded-full w-7 h-7 flex items-center justify-center">
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center">{quantities[p.id] || 1}</span>
                <button onClick={() => changeQty(p.id, 1)} className="border rounded-full w-7 h-7 flex items-center justify-center">
                  <Plus size={14} />
                </button>
                <button onClick={() => handleAdd(p)} className="ml-3 bg-[#00454E] text-white px-3 py-1 rounded-lg text-sm">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
