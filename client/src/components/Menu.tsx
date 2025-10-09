import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import MenuItem from "./MenuItem";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  options?: string[];
  addons?: { name: string; price: number }[];
}

const Menu: React.FC = () => {
  const { cart } = useContext(CartContext);
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
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-[#00454E] mb-4">
        Menu
      </h2>
      {products.map((product) => (
        <MenuItem key={product.id} {...product} />
      ))}
    </div>
  );
};

export default Menu;
