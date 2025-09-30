import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { getAddons } from "@/api/api";

interface Addon {
  id: string;
  name: string;
  price: number;
  description?: string;
}

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
  const [addons, setAddons] = useState<Addon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [showCustomize, setShowCustomize] = useState(false);

  useEffect(() => {
    // Cargar Add-ons desde Airtable
    getAddons()
      .then((data) => setAddons(data))
      .catch((err) => console.error("Error loading addons:", err));
  }, []);

  useEffect(() => {
    if (selectedOption && options.length > 0) {
      const opt = options.find((o) => o.optionName === selectedOption);
      setSelected(opt ? { ...item, ...opt } : item);
    } else {
      setSelected(item);
    }
  }, [selectedOption, options]);

  const handleOptionChange = (opt: string) => setSelectedOption(opt);

  const handleAddonToggle = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAdd = () => {
    try {
      if (options.length > 0 && !selectedOption) {
        showToast("⚠️ Please select an option before adding.", "warning");
        return;
      }

      const basePrice = selected.price || item.price;
      const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
      const totalPrice = basePrice + addonsTotal;

      const productToAdd = {
        id: selected.id,
        name: selectedOption
          ? `${item.name} - ${selectedOption}`
          : item.name,
        price: totalPrice,
        image_url: selected.image_url || item.image_url,
        description:
          selected.description || item.description,
        addons: selectedAddons.map((a) => a.name).join(", "),
      };

      addToCart(productToAdd);
      showToast(
        `✅ Added ${productToAdd.name} ($${productToAdd.price.toFixed(2)})`,
        "success"
      );
      setSelectedAddons([]);
      setShowCustomize(false);
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
      <h3 className="font-semibold text-lg text-center">{selected.name}</h3>
      <p className="text-sm text-gray-500 mb-1 text-center">
        {selected.description}
      </p>
      <p className="font-bold mb-2">${selected.price.toFixed(2)}</p>

      {/* Opciones Hot / Iced */}
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

      {/* Customize toggle */}
      <label className="flex items-center gap-2 mb-3 cursor-pointer">
        <input
          type="checkbox"
          checked={showCustomize}
          onChange={(e) => setShowCustomize(e.target.checked)}
        />
        <span className="text-sm font-medium">Customize your drink</span>
      </label>

      {/* Addons list */}
      {showCustomize && (
        <div className="w-full mb-3 border-t pt-3">
          {addons.length > 0 ? (
            addons.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center justify-between text-sm mb-2 cursor-pointer"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={selectedAddons.some((a) => a.id === addon.id)}
                    onChange={() => handleAddonToggle(addon)}
                    className="mr-2"
                  />
                  {addon.name}
                </div>
                <span className="text-gray-600">
                  +${addon.price.toFixed(2)}
                </span>
              </label>
            ))
          ) : (
            <p className="text-xs text-gray-400">No addons available.</p>
          )}
        </div>
      )}

      <button
        onClick={handleAdd}
        className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
      >
        Add to Cart
      </button>
    </div>
  );
}
