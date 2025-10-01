import React, { useState, useContext } from "react";
import { CartContext } from "@/context/CartContext";

interface MenuItemProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    is_hot?: boolean;
    is_iced?: boolean;
  };
}

export default function MenuItem({ product }: MenuItemProps) {
  const { addToCart } = useContext(CartContext);

  // ✅ Por defecto: si el producto tiene opción "Hot", la selecciona automáticamente
  const [selectedOption, setSelectedOption] = useState<string>(
    product.is_hot ? "Hot" : product.is_iced ? "Iced" : ""
  );

  const [customize, setCustomize] = useState(false);

  const handleAddToCart = () => {
    if (!selectedOption) {
      alert("Please select Hot or Iced before adding to your order.");
      return;
    }

    addToCart({
      id: product.id,
      name: `${product.name} (${selectedOption})`,
      price: product.price,
      option: selectedOption,
    });

    alert(`${product.name} added to your order!`);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      {/* ✅ Imagen segura con fallback */}
      <img
        src={product.image_url || "/attached_assets/tnclogo.png"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />

      {/* ✅ Nombre y descripción */}
      <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
      <p className="text-sm text-gray-600 mb-2">{product.description}</p>

      {/* ✅ Opciones Hot / Iced */}
      <div className="flex gap-2 mb-3">
        {product.is_hot && (
          <button
            onClick={() => setSelectedOption("Hot")}
            className={`px-3 py-1 rounded-md border ${
              selectedOption === "Hot"
                ? "bg-amber-600 text-white border-amber-700"
                : "bg-white text-gray-800 border-gray-300 hover:bg-amber-50"
            }`}
          >
            Hot
          </button>
        )}
        {product.is_iced && (
          <button
            onClick={() => setSelectedOption("Iced")}
            className={`px-3 py-1 rounded-md border ${
              selectedOption === "Iced"
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
            }`}
          >
            Iced
          </button>
        )}
      </div>

      {/* ✅ Customize checkbox */}
      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={customize}
          onChange={(e) => setCustomize(e.target.checked)}
        />
        <span className="font-medium">Customize your drink</span>
      </label>

      {/* ✅ Sección dinámica para Add-ons */}
      {customize && (
        <div className="mb-3 text-sm text-gray-700 border rounded p-2 bg-gray-50">
          <p>✨ Add-ons list coming soon (van desde Airtable / AddOns)</p>
        </div>
      )}

      {/* ✅ Precio */}
      <p className="text-lg font-semibold mb-3">${product.price.toFixed(2)}</p>

      {/* ✅ Botón de agregar */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedOption}
        className={`w-full py-2 rounded-md font-medium ${
          selectedOption
            ? "bg-amber-600 text-white hover:bg-amber-700"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        Add to Order
      </button>
    </div>
  );
}
