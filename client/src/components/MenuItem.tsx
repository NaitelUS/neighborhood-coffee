import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductOption {
  optionName: string;
  price?: number;
  description?: string;
  image_url?: string;
  temperature?: "Hot" | "Iced";
}

interface MenuItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    temperature?: "Hot" | "Iced";
  };
  options?: ProductOption[];
}

export default function MenuItem({ item, options = [] }: MenuItemProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedTemp, setSelectedTemp] = useState<"Hot" | "Iced">("Hot");
  const [selected, setSelected] = useState<any>(item);

  // 🔄 Cambia el producto seleccionado cuando cambia opción o temperatura
  useEffect(() => {
    let opt = options.find(
      (o) =>
        o.optionName === selectedOption &&
        (o.temperature === selectedTemp || !o.temperature)
    );
    if (!opt && options.length > 0) {
      opt = options.find((o) => o.temperature === selectedTemp);
    }

    setSelected(opt ? { ...item, ...opt } : item);
  }, [selectedOption, selectedTemp, options]);

  const handleOptionChange = (opt: any) => setSelectedOption(opt);
  const handleTempChange = (temp: "Hot" | "Iced") => setSelectedTemp(temp);

  const handleAdd = () => {
    try {
      if (options.length > 0 && !selectedOption) {
        showToast("⚠️ Please select an option before adding.", "warning");
        return;
      }

      const productToAdd = {
        id: `${selected.id}-${selectedTemp}-${selectedOption || "base"}`,
        name: `${item.name} (${selectedTemp})${
          selectedOption ? ` - ${selectedOption}` : ""
        }`,
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

  const hasHot = options.some((o) => o.temperature === "Hot");
  const hasIced = options.some((o) => o.temperature === "Iced");

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col items-center">
      <img
        src={selected.image_url || "/placeholder.png"}
        alt={selected.name}
        className="w-32 h-32 object-cover rounded-lg mb-2 transition-all duration-300"
      />

      <h3 className="font-semibold text-lg">{item.name}</h3>
      <p className="text-sm text-gray-500 mb-1 text-center">
        {selected.description}
      </p>
      <p className="font-bold mb-2">${selected.price.toFixed(2)}</p>

      {/* ☕ Selector Hot / Iced */}
      <div className="flex gap-2 mb-3">
        {hasHot && (
          <button
            onClick={() => handleTempChange("Hot")}
            className={`px-3 py-1 rounded-full border ${
              selectedTemp === "Hot"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-gray-100"
            }`}
          >
            ☕ Hot
          </button>
        )}
        {hasIced && (
          <button
            onClick={() => handleTempChange("Iced")}
            className={`px-3 py-1 rounded-full border ${
              selectedTemp === "Iced"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100"
            }`}
          >
            🧊 Iced
          </button>
        )}
      </div>

      {/* 🔘 Botones de opciones */}
      {options.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {options
            .filter(
              (opt) =>
                !opt.temperature || opt.temperature === selectedTemp
            )
            .map((opt) => (
              <button
                key={opt.optionName}
                onClick={() => handleOptionChange(opt.optionName)}
                className={`px-3 py-1 rounded-full border ${
                  selectedOption === opt.optionName
                    ? "bg-primary text-white"
                    : "bg-gray-100"
                }`}
              >
                {opt.optionName}
              </button>
            ))}
        </div>
      )}

      {/* Add to Cart */}
      <button
        onClick={handleAdd}
        className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
