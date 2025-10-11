// === VERSION MOBILE-CAROUSEL (Checkpoint 1.4) ===
// To rollback: replace with Menu_Checkpoint1.3

import React, { useEffect, useState } from "react";
import MenuItem from "@/components/MenuItem";

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  available?: boolean;
  image_url?: string;
}

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/.netlify/functions/products");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        const valid = Array.isArray(data)
          ? data.filter((p) => p.available !== false)
          : [];
        setProducts(valid);
      } catch (err) {
        console.error(err);
        setError("Unable to load products right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading menu...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  const groupBy = (cat: string) =>
    products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase());

  const sections = [
    { title: "☕ House Brews", key: "Coffee" },
    { title: "🥐 From the Oven", key: "Pastry" },
    { title: "🍂 Neighbor’s Picks", key: "Special" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-amber-900 mb-10 tracking-wide">
        Our Menu
      </h1>

      <div className="space-y-16">
        {sections.map(({ title, key }) => {
          const items = groupBy(key);
          if (!items.length) return null;
          return (
            <section key={key}>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-amber-900">
                  {title}
                </h2>
                <div className="w-32 h-1 mx-auto mt-3 bg-gradient-to-r from-amber-700 to-yellow-500 rounded-full"></div>
              </div>

              {/* mobile carousel */}
              <div className="block md:hidden overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4">
                <div className="flex space-x-6 px-2">
                  {items.map((p) => (
                    <div
                      key={p.id}
                      className="snap-center flex-shrink-0 w-[80%] mx-auto"
                    >
                      <MenuItem product={p} />
                    </div>
                  ))}
                </div>
              </div>

              {/* desktop grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((p) => (
                  <div key={p.id} className="flex justify-center">
                    <MenuItem product={p} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No products available at this time.
        </p>
      )}
    </div>
  );
}
