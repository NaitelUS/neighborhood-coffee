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
}

const MenuItem: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  price,
  options = [],
  addons = [],
}) => {
  const { addToCart } = useContext(CartContext);

  const [selectedOption, setSelectedOption] = useState(options[0] || "");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);

  const handleAddOnChange = (addon: AddOn, isChecked: boolean) => {
    setSelectedAddOns((prev) =>
      isChecked
        ? [...prev, addon]
        : prev.filter((a) => a.name !== addon.name)
    );
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      option: selectedOption,
      price: Number(price ?? 0),
      addons: selectedAddOns,
      quantity,
    });
    setSelectedAddOns([]);
    setQuantity(1);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-4 border border-gray-100 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#00454E]">{name}</h2>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          <p className="text-md font-bold mt-1">
            ${Number(price ?? 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Opciones (Hot / Iced, etc.) */}
      {options.length > 0 && (
        <div className="mt-3">
          <label className="text-sm font-medium text-gray-700 mr-2">
            Option:
          </label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="border rounded-lg px-2 py-1 text-sm"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* AddOns */}
      {addons.length > 0 && (
        <div className="mt-3">
          <AddOnSelector
            addons={addons}
            selectedAddOns={selectedAddOns}
            onChange={handleAddOnChange}
          />
        </div>
      )}

      {/* Quantity Selector */}
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

      {/* Botón Agregar */}
      <button
        onClick={handleAddToCart}
        className="w-full mt-4 bg-[#00454E] text-white rounded-xl py-2 font-semibold hover:bg-[#1D9099] transition"
      >
        Add to Order
      </button>
    </div>
  );
};

export default MenuItem;
