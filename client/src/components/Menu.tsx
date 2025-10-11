import React, { useEffect, useState } from "react";
import MenuItem from "@/components/MenuItem";

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  hot_available?: boolean;
  iced_available?: boolean;
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

        // ✅ Solo productos disponibles
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

  // ✅ Agrupar por categoría
  const categories = ["Coffee", "Specials", "Pastry"];
  const groupedProducts = categories.map((cat) => ({
    name: cat,
    items: products.filter(
      (p) =>
        p.category?.toLowerCase() === cat.toLowerCase() &&
        p.available !== false
    ),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Our Menu
      </h1>

      {groupedProducts.map(
        (group) =>
          group.items.length > 0 && (
            <section key={group.name} className="mb-10">
              <h2 className="text-2xl font-semibold text-emerald-700 mb-4 border-b border-emerald-200 pb-2 text-center">
                {group.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {group.items.map((product) => (
                  <div key={product.id} className="flex justify-center">
                    <MenuItem product={product} />
                  </div>
                ))}
              </div>
            </section>
          )
      )}
    </div>
  );
}
