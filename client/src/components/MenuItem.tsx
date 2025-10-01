import React, { useState, useContext } from "react";
import { CartContext } from "@/context/CartContext";
import AddOnSelector from "@/components/AddOnSelector";

interface AddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
}

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

  // ✅ Hot por defecto si existe
  const [selectedOption, setSelectedOption] = useState<string>(
    product.is_hot ? "Hot" : product.is_iced ? "Iced" : ""
  );

  const [customize, setCustomize] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  // ✅ Calcula total con Add-Ons
  const totalPrice =
    product.price + selectedAddOns.reduce((sum, a) => sum + a.price, 0);

  const handleAddToCart = () => {
    if (!selectedOption) {
      alert("Please select Hot or Iced before adding to your order.");
      return;
    }

    const itemName = `${product.name} (${selectedOption})`;

    addToCart({
      id: product.id,
      name: itemName,
      price: totalPrice,
      option: selectedOption,
      addons: selectedAddOns.map((a) => ({
        name: a.name,
        price: a.price,
      })),
    });

    alert(`${itemName} added to your order!`);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all">
      {/* ✅ Imagen del producto */}
      <img
        src={product.image_url || "/attached_assets/tnclogo.png"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />

      {/* ✅ Nombre y descripción */}
      <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
      <p className="text-sm text-gray-600 mb-2">{product.description}</p>

      {/* ✅ Botones Hot / Iced */}
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

      {/* ✅ Checkbox Customize */}
      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={customize}
          onChange={(e) => setCustomize(e.target.checked)}
        />
        <span className="font-medium">Customize your drink</span>
      </label>

      {/* ✅ Add-Ons dinámicos (solo una vez) */}
      {customize && (
        <AddOnSelector
          onSelect={(addons) => {
            setSelectedAddOns(addons);
          }}
        />
      )}

      {/* ✅ Total dinámico */}
      <div className="mt-3 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-800">
          ${totalPrice.toFixed(2)}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={!selectedOption}
          className={`px-4 py-2 rounded-md font-medium ${
            selectedOption
              ? "bg-amber-600 text-white hover:bg-amber-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Add to Order
        </button>
      </div>
    </div>
  );
}
