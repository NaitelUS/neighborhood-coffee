import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/use-toast";

interface MenuItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
  };
  options?: {
    optionName: string;
    price?: number;
    description?: string;
    image_url?: string;
  }[];
}

export default function MenuItem({ item, options = [] }: MenuItemProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(item);

  useEffect(() => {
    if (selectedOption && options.length > 0) {
      const opt = options.find((o) => o.optionName === selectedOption);
      setSelected(opt ? { ...item, ...opt } : item);
    } else {
      setSelected(item);
    }
  }, [selectedOption, options]);

  const handleOptionChange = (opt: any) => setSelectedOption(opt);

  const handleAdd = () => {
    try {
      // 🚫 Si tiene opciones y no ha elegido ninguna
      if (options.length > 0 && !selectedOption) {
        showToast("⚠️ Please select an option before adding.", "warning");
        return;
      }

      const productToAdd = {
        id: selected.id,
        name: selectedOption
          ? `${item.name} - ${selectedOption}`
          : item.name,
        price: selected.price || item.price,
        image_url: selected.image_url || item.image_url,
        description: selected.description || item.description,
      };

      addToCart(productToAdd);
      showToast(
        `✅ Added ${productToAdd.name} ($${productToAdd.price.toFixed(2)})`,
        "success"
      );
    } catch (err) {
      console.error("Add to cart error:", err);
      showToast("❌ Something went wrong adding this item", "error");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col items-center">
      <img
        src={selected.image_url || "/placeholder.png"}
        alt={selected.name}
        className="w-32 h-32 object-cover rounded-lg mb-2"
      />
      <h3 className="font-semibold text-lg">{selected.name}</h3>
      <p className="text-sm text-gray-500 mb-1">{selected.description}</p>
      <p className="font-bold mb-2">${selected.price.toFixed(2)}</p>

      {/* 🔘 Botones dinámicos de opciones */}
      {options.length > 0 && (
        <div className="flex gap-2 mb-3">
          {options.map((opt) => (
            <button
              key={opt.optionName}
              onClick={() => handleOptionChange(opt.optionName)}
              className={`px-3 py-1 rounded-full border ${
                selectedOption === opt.optionName
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {opt.optionName}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleAdd}
        className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
