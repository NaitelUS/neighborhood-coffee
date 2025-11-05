// === VERSION STICKY CATEGORY BAR (Checkpoint 1.6 - FIXED OVERFLOW) ===
// This keeps your Airtable logic + design, but prevents lateral scroll.

import React, { useEffect, useState, useRef } from "react";
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

  const refs = {
    Coffee: useRef<HTMLDivElement>(null),
    Pastry: useRef<HTMLDivElement>(null),
    Special: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/.netlify/functions/products");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
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
    return <p className="text-center text-gray-600 mt-10 animate-pulse">Loading menu...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  const groupBy = (cat: string) =>
    products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase());

  const sections = [
    { title: "☕ House Brews", key: "Coffee" },
    { title: "🥐 From the Oven", key: "Pastry" },
    { title: "🍂 Neighbor’s Picks", key: "Special" },
  ];

  const scrollTo = (key: keyof typeof refs) => {
    refs[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="menu-wrapper max-w-7xl mx-auto px-4 py-10 relative overflow-x-hidden">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-amber-900 mb-10 tracking-wide animate-fadeIn">
        Our Menu
      </h1>

      {/* Sticky category bar */}
      <div className="sticky top-0 z-10 py-3 backdrop-blur-sm text-center mb-10 overflow-hidden">
        <div className="flex justify-center space-x-6 text-amber-900 font-medium text-sm md:text-base overflow-x-auto scrollbar-hide px-2">
          {sections.map(({ title, key }) => (
            <button
              key={key}
              onClick={() => scrollTo(key as keyof typeof refs)}
              className="transition-colors hover:text-amber-700"
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-16 overflow-hidden">
        {sections.map(({ title, key }) => {
          const items = groupBy(key);
          if (!items.length) return null;
          return (
            <section
              key={key}
              ref={refs[key as keyof typeof refs]}
              className="animate-fadeIn overflow-hidden"
            >
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
                      className="snap-center flex-shrink-0 w-[80%] mx-auto transition-transform duration-300 ease-in-out transform hover:scale-105"
                    >
                      <div className="shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden bg-white">
                        <MenuItem product={p} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* desktop grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 overflow-hidden">
                {items.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-center transition-transform duration-300 ease-in-out transform hover:scale-105"
                  >
                    <div className="shadow-md hover:shadow-xl rounded-2xl bg-white overflow-hidden">
                      <MenuItem product={p} />
                    </div>
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
