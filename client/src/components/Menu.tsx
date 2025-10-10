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
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/.netlify/functions/products");
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("⚠️ Error loading menu:", err);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // escuchar evento desde MenuItem cuando se agrega al carrito
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail?.name) {
        setToast(`✅ Added ${e.detail.name} to cart`);
        setTimeout(() => setToast(null), 2000);
      }
    };
    window.addEventListener("itemAdded", handler as EventListener);
    return () =>
      window.removeEventListener("itemAdded", handler as EventListener);
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

  // agrupar por categoría
  const grouped = products.reduce((acc: Record<string, Product[]>, p) => {
    const cat = p.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const icons: Record<string, string> = {
    Coffee: "☕",
    Pastry: "🥐",
    Special: "✨",
    Other: "🍽️",
  };

  return (
    <div className="relative min-h-screen bg-[#f7f3ef] py-10 px-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-300">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif text-[#4a2e2b] mb-10 text-center">
          Our Menu
        </h2>

        {Object.keys(grouped).map((category) => (
          <section key={category} className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <span className="text-3xl mr-2">{icons[category]}</span>
              <h3 className="text-2xl font-semibold text-[#4a2e2b] border-b-2 border-[#d4b996] pb-1">
                {category}
              </h3>
            </div>

            {/* 💎 grid corregido */}
            <div
              className="
                grid
                gap-10
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-3
                2xl:grid-cols-4
                justify-items-center
              "
            >
              {grouped[category].map((product) => (
                <div
                  key={product.id}
                  className="w-full max-w-sm bg-white rounded-2xl shadow-md hover:shadow-xl border border-[#e6dfd8] overflow-hidden"
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
