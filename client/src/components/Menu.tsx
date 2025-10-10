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
  available?: boolean;
}

const Menu: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [customizingId, setCustomizingId] = useState<string | null>(null);

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
    <div className="relative min-h-screen bg-white py-8 px-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-300 z-50">
          {toast}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-4xl font-serif text-[#00454E] mb-8 text-center">
          Our Menu
        </h2>

        {Object.keys(grouped).map((category) => (
          <section key={category} className="mb-10">
            <div className="flex items-center justify-center mb-5">
              <span className="text-3xl mr-2">{icons[category]}</span>
              <h3 className="text-2xl font-semibold text-[#00454E] border-b-2 border-[#1D9099] pb-1">
                {category}
              </h3>
            </div>

            {/* Layout + scroll lateral */}
            <div
              className="
                flex flex-wrap justify-center gap-8 
                overflow-x-auto snap-x snap-mandatory pb-3
                sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:overflow-visible
              "
            >
              {grouped[category].map((product) => (
                <div
                  key={product.id}
                  className="
                    flex-shrink-0 snap-center
                    w-[85%] sm:w-full max-w-sm bg-white rounded-2xl
                    shadow-md hover:shadow-xl border border-[#e6dfd8]
                    overflow-hidden flex flex-col justify-between
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

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <MenuItem {...product} />
                  </div>

                  {/* Customize drink */}
                  {product.available !== false && (
                    <div className="px-5 pb-4">
                      <button
                        onClick={() =>
                          setCustomizingId(
                            customizingId === product.id ? null : product.id
                          )
                        }
                        className="text-sm font-medium text-[#00454E] hover:text-[#1D9099] mt-2"
                      >
                        {customizingId === product.id
                          ? "Close customization ✖️"
                          : "☕ Customize your drink"}
                      </button>

                      {customizingId === product.id && (
                        <div className="mt-3 bg-[#f3f9fa] rounded-xl p-3 text-sm text-[#00454E] space-y-2 border border-[#cfe7e8]">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" />{" "}
                            <span>Extra shot of espresso (+$1.00)</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" />{" "}
                            <span>Oat milk (+$0.75)</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" />{" "}
                            <span>Whipped cream (+$0.50)</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" />{" "}
                            <span>Caramel drizzle (+$0.50)</span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Coming soon */}
                  {product.available === false && (
                    <div className="bg-[#f8f8f8] text-center py-3 border-t border-[#e6dfd8]">
                      <span className="text-[#00454E] font-medium text-sm">
                        🕓 Coming Soon!
                      </span>
                    </div>
                  )}
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
