import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import AddOnSelector from "./AddOnSelector";

interface AddOn {
  name: string;
  price: number;
}

interface MenuItemProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  options?: string[];
  addons?: AddOn[];
  available?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  price,
  options = [],
  addons = [],
  available = true,
}) => {
  const { addToCart } = useContext(CartContext);
  const [selectedOption, setSelectedOption] = useState(options[0] || "");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddOnChange = (addon: AddOn, isChecked: boolean) => {
    setSelectedAddOns((prev) =>
      isChecked
        ? [...prev, addon]
        : prev.filter((a) => a.name !== addon.name)
    );
  };

  const handleAddToCart = () => {
    if (!available) return; // bloquea productos "Coming Soon"

    addToCart({
      id,
      name,
      option: selectedOption,
      price: Number(price ?? 0),
      addons: selectedAddOns,
      quantity,
    });

    // 🔔 Dispara toast global (capturado en Menu)
    window.dispatchEvent(
      new CustomEvent("itemAdded", { detail: { name } })
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setSelectedAddOns([]);
    setQuantity(1);
  };

  return (
    <div>
      {/* Nombre y descripción */}
      <h2 className="text-lg font-semibold text-[#00454E]">{name}</h2>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}

      {/* Precio */}
      <p className="text-md font-bold mt-2 text-[#00454E]">
        ${Number(price ?? 0).toFixed(2)}
      </p>

      {/* Opciones */}
      {options.length > 0 && (
        <div className="mt-3">
          <label className="text-sm font-medium text-gray-700 mr-2">
            Option:
          </label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="border rounded-lg px-2 py-1 text-sm bg-white"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add-ons */}
      {addons.length > 0 && (
        <div className="mt-3">
          <AddOnSelector
            addons={addons}
            selectedAddOns={selectedAddOns}
            onChange={handleAddOnChange}
          />
        </div>
      )}

      {/* Cantidad */}
      <div className="mt-3 flex items-center space-x-2">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
        >
          −
        </button>
        <span className="w-6 text-center">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
        >
          +
        </button>
      </div>

      {/* Botón principal */}
      <button
        onClick={handleAddToCart}
        disabled={!available}
        className={`w-full mt-4 rounded-xl py-2 font-semibold transition ${
          available
            ? added
              ? "bg-[#1D9099] text-white"
              : "bg-[#1D9099] text-white hover:bg-[#00454E]"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        {available ? (added ? "✅ Added!" : "Add to Order") : "Coming Soon"}
      </button>
    </div>
  );
};

export default MenuItem;
