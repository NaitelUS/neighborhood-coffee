import React, { useEffect, useState, useContext } from "react";
import MenuItem from "@/components/MenuItem";
import { Link } from "react-router-dom";
import { CartContext } from "@/context/CartContext";

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
  const { cartItems } = useContext(CartContext);

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

  const totalItems = cartItems.reduce((sum, item) => sum + 1, 0);

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">Loading menu...</p>
    );
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 relative">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Our Menu
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 pb-24">
          {products.map((product) => (
            <div key={product.id} className="flex justify-center">
              <MenuItem product={product} />
            </div>
          ))}
        </div>
      )}

      {/* 🛍️ Botón flotante View Order */}
      {totalItems > 0 && (
        <Link
          to="/order"
          className="fixed bottom-5 right-5 bg-[#1D9099] hover:bg-[#00454E] text-white px-5 py-3 rounded-full shadow-lg text-sm font-semibold transition-all duration-200"
        >
          View Order ({totalItems})
        </Link>
      )}
    </div>
  );
}
