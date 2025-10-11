import React, { useEffect, useState } from "react";
import MenuItem from "@/components/MenuItem";

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  is_hot?: boolean;
  is_iced?: boolean;
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
        const validProducts = Array.isArray(data)
          ? data.filter((p) => p.available !== false)
          : [];

        setProducts(validProducts);
      } catch (err: any) {
        console.error("Error fetching products:", err);
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

  const groupByCategory = (category: string) =>
    products.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );

  const coffeeItems = groupByCategory("Coffee");
  const pastryItems = groupByCategory("Pastry");
  const specialItems = groupByCategory("Special");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-amber-900 text-center tracking-wide">
        Our Menu
      </h1>

      {/* SECTION WRAPPER */}
      <div className="space-y-16">

        {/* ☕ House Brews */}
        {coffeeItems.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-900">
                ☕ House Brews
              </h2>
              <div className="w-32 h-1 mx-auto mt-3 bg-gradient-to-r from-amber-700 to-yellow-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {coffeeItems.map((product) => (
                <div key={product.id} className="flex justify-center">
                  <MenuItem product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 🥐 From the Oven */}
        {pastryItems.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-900">
                🥐 From the Oven
              </h2>
              <div className="w-32 h-1 mx-auto mt-3 bg-gradient-to-r from-amber-700 to-yellow-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {pastryItems.map((product) => (
                <div key={product.id} className="flex justify-center">
                  <MenuItem product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 🍂 Neighbor’s Picks */}
        {specialItems.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-900">
                🍂 Neighbor’s Picks
              </h2>
              <p className="text-sm text-amber-800 italic">
                Seasonal favorites and limited-time blends
              </p>
              <div className="w-32 h-1 mx-auto mt-3 bg-gradient-to-r from-amber-700 to-yellow-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {specialItems.map((product) => (
                <div key={product.id} className="flex justify-center">
                  <MenuItem product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No products available at this time.
        </p>
      )}
    </div>
  );
}
