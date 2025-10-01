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
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        // ✅ Filtra productos disponibles
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

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading menu...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Our Menu
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <MenuItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
