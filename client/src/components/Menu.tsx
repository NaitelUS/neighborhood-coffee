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
  category?: string;
}

const Menu: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("/.netlify/functions/products");
        const data = await response.json();

        if (Array.isArray(data)) setProducts(data);
        else if (Array.isArray(data.records)) {
          setProducts(
            data.records.map((r: any) => ({
              id: r.id,
              name: r.fields.Name,
              description: r.fields.Description || "",
              price: r.fields.Price || 0,
              image:
                r.fields.Image?.[0]?.url ||
                r.fields.image_url ||
                "",
              category: r.fields.Category || "Other",
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading menu…
      </div>
    );

  if (products.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No products available.
      </div>
    );

  // 🔹 Agrupar productos por categoría
  const grouped = products.reduce((acc: Record<string, Product[]>, product) => {
    const category = product.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#00454E] mb-6 text-center">
        Our Menu
      </h2>

      {Object.keys(grouped).map((category) => (
        <section key={category} className="mb-10">
          <h3 className="text-2xl font-semibold text-[#00454E] mb-4 border-b pb-2">
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped[category].map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition overflow-hidden"
              >
                {product.image && (
                  <img
                    src={
                      product.image.startsWith("/attached_assets/")
                        ? product.image
                        : `/attached_assets/${product.image}`
                    }
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
        </section>
      ))}
    </div>
  );
};

export default Menu;
