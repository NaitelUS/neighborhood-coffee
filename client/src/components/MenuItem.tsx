import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { formatProductName } from "../utils/formatProductName";

interface AddOn {
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  addons?: AddOn[];
}

export default function MenuItem({ product }: { product: Product }) {
  const { addToCart } = useContext(CartContext);
  const [selectedOption, setSelectedOption] = useState("Hot");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const isPastry = product.category === "Pastry";

  // 💰 Cálculo de precio total
  const basePrice = product.price || 0;
  const addOnTotal = selectedAddOns.reduce(
    (sum, addon) => sum + (addon.price || 0),
    0
  );
  const totalPrice = basePrice + addOnTotal;

  // 🧩 Toggle de add-ons
  const toggleAddOn = (addon: AddOn) => {
    if (selectedAddOns.some((a) => a.name === addon.name)) {
      setSelectedAddOns((prev) => prev.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddOns((prev) => [...prev, addon]);
    }
  };

  // 🧾 Agregar al carrito
  const handleAddToCart = () => {
    const itemName = formatProductName(product.name, selectedOption);
    addToCart({
      id: product.id,
      name: itemName,
      price: totalPrice,
      option: selectedOption,
      addons: !isPastry
        ? selectedAddOns.map((a) => ({
            name: a.name,
            price: a.price,
          }))
        : [],
      qty: 1,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center">
      <p className="text-lg font-semibold text-[#00454E] mb-2">
        {formatProductName(product.name, selectedOption)}
      </p>
      <p className="text-gray-600 mb-3">${totalPrice.toFixed(2)}</p>

      {/* ☕ Opciones de bebida */}
      {!isPastry && (
        <div className="flex space-x-3 mb-3">
          {["Hot", "Iced"].map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className={`px-3 py-1 rounded-full border ${
                selectedOption === opt
                  ? "bg-[#00454E] text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* 🧩 Add-ons */}
      {!isPastry && product.addons && product.addons.length > 0 && (
        <div className="w-full border-t pt-2 mt-2 text-left">
          <p className="text-sm text-gray-500 mb-1">Customize:</p>
          {product.addons.map((addon) => (
            <label
              key={addon.name}
              className="flex items-center justify-between text-sm mb-1"
            >
              <span>{addon.name}</span>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 text-xs">
                  +${addon.price.toFixed(2)}
                </span>
                <input
                  type="checkbox"
                  checked={selectedAddOns.some((a) => a.name === addon.name)}
                  onChange={() => toggleAddOn(addon)}
                  className="accent-[#00454E]"
                />
              </div>
            </label>
          ))}
        </div>
      )}

      {/* 🛒 Botón agregar */}
      <button
        onClick={handleAddToCart}
        className="mt-4 w-full bg-[#00454E] text-white py-2 rounded-lg font-semibold hover:bg-[#00363C]"
      >
        Add to Order
      </button>
    </div>
  );
}
