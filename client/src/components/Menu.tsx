import React, { useEffect, useState } from "react";
import MenuItem from "./MenuItem";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  options?: string[];
  addons?: { name: string; price: number }[];
  image?: string;
}

const Menu: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("/.netlify/functions/products");
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.records)) {
          setProducts(
            data.records.map((r: any) => ({
              id: r.id,
              name: r.fields.Name,
              description: r.fields.Description || "",
              price: r.fields.Price || 0,
              options: r.fields.Options || [],
              addons: r.fields.AddOns || [],
              image: r.fields.Image?.[0]?.url || "", // 👈 carga la imagen de Airtable
            }))
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("⚠️ Error loading menu:", err);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading menu…
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No products available.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#00454E] mb-6 text-center">
        Our Menu
      </h2>

      {/* 🧃 Grid tipo cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition overflow-hidden"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <MenuItem {...product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
