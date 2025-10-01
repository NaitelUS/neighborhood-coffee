import React, { useState, useContext } from "react";
import { CartContext } from "@/context/CartContext";
import AddOnSelector from "@/components/AddOnSelector";

interface MenuItemProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    category?: string;
    image_url?: string | null;
  };
}

export default function MenuItem({ product }: MenuItemProps) {
  const { addToCart } = useContext(CartContext);
  const [temperature, setTemperature] = useState<"Hot" | "Iced" | null>(null);
  const [flavor, setFlavor] = useState<"Apple" | "Pineapple" | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [addons, setAddons] = useState<any[]>([]);

  // ✅ Precio base
  const basePrice = product.price || 0;
  const addonsTotal = addons.reduce((acc, a) => acc + (a.price || 0), 0);
  const finalPrice = basePrice + addonsTotal;

  // ✅ Fallback para imagen
  const imageSrc =
    product.image_url || "/attached_assets/tnclogo.png";

  const handleAddToCart = () => {
    addToCart({
      ...product,
      price: finalPrice,
      temperature,
      flavor,
      addons,
      quantity: 1,
    });
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
      {/* 🖼 Imagen del producto */}
      <img
        src={imageSrc}
        alt={product.name || "Coffee Item"}
        className="w-full h-40 object-cover rounded-md border border-border"
        onError={(e) => {
          e.currentTarget.src = "/attached_assets/tnclogo.png";
        }}
      />

      {/* 🧾 Información */}
      <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
      {product.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {product.description}
        </p>
      )}

      {/* ☕ Toggle Hot/Iced */}
      {product.category?.toLowerCase() === "drink" && (
        <div className="flex gap-3 mt-3">
          <button
            className={`px-3 py-1 rounded-md text-sm border ${
              temperature === "Hot"
                ? "bg-amber-600 text-white"
                : "hover:bg-amber-50"
            }`}
            onClick={() => setTemperature("Hot")}
          >
            Hot
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm border ${
              temperature === "Iced"
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-50"
            }`}
            onClick={() => setTemperature("Iced")}
          >
            Iced
          </button>
        </div>
      )}

      {/* 🥧 Toggle Apple/Pineapple */}
      {product.category?.toLowerCase() === "empanada" && (
        <div className="flex gap-3 mt-3">
          <button
            className={`px-3 py-1 rounded-md text-sm border ${
              flavor === "Apple"
                ? "bg-amber-600 text-white"
                : "hover:bg-amber-50"
            }`}
            onClick={() => setFlavor("Apple")}
          >
            Apple
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm border ${
              flavor === "Pineapple"
                ? "bg-yellow-500 text-white"
                : "hover:bg-yellow-50"
            }`}
            onClick={() => setFlavor("Pineapple")}
          >
            Pineapple
          </button>
        </div>
      )}

      {/* 🧩 Customize your drink */}
      {product.category?.toLowerCase() === "drink" && (
        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={showCustomize}
              onChange={() => setShowCustomize(!showCustomize)}
            />
            Customize your drink
          </label>

          {showCustomize && (
            <div className="mt-3 border-t border-border pt-3">
              <AddOnSelector onChange={setAddons} />
            </div>
          )}
        </div>
      )}

      {/* 💰 Precio y botón */}
      <div className="flex justify-between items-center mt-4">
        <span className="font-semibold">${finalPrice.toFixed(2)}</span>
        <button
          onClick={handleAddToCart}
          className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-md transition"
        >
          Add to Order
        </button>
      </div>
    </div>
  );
}
