import React, { useEffect, useState } from "react";
import MenuItem from "./MenuItem";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  image_url?: string;
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
        Brewing your menu…
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

  const categoryIcons: Record<string, string> = {
    Coffee: "☕",
    Pastry: "🥐",
    Special: "✨",
    Other: "🍽️",
  };

  return (
    <div className="min-h-screen bg-[#f7f3ef] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif text-[#4a2e2b] mb-10 text-center">
          Our Menu
        </h2>

        {Object.keys(grouped).map((category) => (
          <section key={category} className="mb-12">
            {/* Encabezado de categoría */}
            <div className="flex items-center justify-center mb-6">
              <span className="text-3xl mr-2">
                {categoryIcons[category] || "☕"}
              </span>
              <h3 className="text-2xl font-semibold text-[#4a2e2b] border-b-2 border-[#d4b996] pb-1">
                {category}
              </h3>
            </div>

            {/* 💎 Grid responsivo */}
            <div
              className="
                grid 
                gap-8 
                grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-3 
                xl:grid-cols-4 
                place-items-center
              "
            >
              {grouped[category].map((product) => (
                <div
                  key={product.id}
                  className="
                    w-full max-w-sm bg-white rounded-2xl 
                    shadow-md hover:shadow-xl 
                    transition duration-200 
                    overflow-hidden border border-[#e6dfd8]
                  "
                >
                  {(product.image || product.image_url) && (
                    <img
                      src={
                        (product.image || product.image_url).startsWith(
                          "/attached_assets/"
                        )
                          ? product.image || product.image_url
                          : `/attached_assets/${product.image || product.image_url}`
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                  )}

                  <div className="p-5">
                    <MenuItem {...product} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Menu;
