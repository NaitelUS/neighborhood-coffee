import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Addon {
  id: string;
  name: string;
  price: number;
}

interface MenuItemProps {
  item: {
    id: string;
    name: string;
    category: string;
    "Hot Price"?: number;
    "Iced Price"?: number;
    "Hot Description"?: string;
    "Iced Description"?: string;
    "Hot Image"?: { url: string }[];
    "Iced Image"?: { url: string }[];
    "Is Iced Available"?: boolean;
  };
  addons?: Addon[];
}

export default function MenuItem({ item, addons = [] }: MenuItemProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [isIced, setIsIced] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  const toggleIced = () => {
    if (item["Is Iced Available"]) setIsIced((prev) => !prev);
  };

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const name = `${item.name}${isIced ? " (Iced)" : " (Hot)"}`;
  const basePrice = isIced
    ? item["Iced Price"] || item["Hot Price"] || 0
    : item["Hot Price"] || 0;

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = basePrice + addonsTotal;

  const description = isIced
    ? item["Iced Description"] || ""
    : item["Hot Description"] || "";
  const image =
    (isIced
      ? item["Iced Image"]?.[0]?.url
      : item["Hot Image"]?.[0]?.url) || "/placeholder.png";

  const handleAdd = () => {
    const productToAdd = {
      id: item.id + (isIced ? "-Iced" : "-Hot"),
      name,
      price: totalPrice,
      description,
      image_url: image,
      addons: selectedAddons.map((a) => a.name),
    };

    addToCart(productToAdd);
    showToast(`✅ Added ${name} ($${totalPrice.toFixed(2)})`, "success");
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col items-center">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 object-cover rounded-lg mb-2"
      />
      <h3 className="font-semibold text-lg text-center">{name}</h3>
      <p className="text-sm text-gray-500 mb-1 text-center">{description}</p>
      <p className="font-bold mb-2">${totalPrice.toFixed(2)}</p>

      {/* Switch Hot/Iced */}
      {item["Is Iced Available"] && (
        <button
          onClick={toggleIced}
          className={`px-4 py-1 mb-3 rounded-full text-sm font-semibold transition ${
            isIced ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
          }`}
        >
          {isIced ? "☀️ Switch to Hot" : "❄️ Switch to Iced"}
        </button>
      )}

      {/* Customize checkbox */}
      <label className="flex items-center gap-2 mb-2 text-sm">
        <input
          type="checkbox"
          checked={showCustomize}
          onChange={() => setShowCustomize(!showCustomize)}
        />
        Customize your drink
      </label>

      {/* Addon options */}
      {showCustomize && addons.length > 0 && (
        <div className="w-full mb-3">
          {addons.map((addon) => (
            <label
              key={addon.id}
              className="flex items-center justify-between text-sm mb-1"
            >
              <span>
                {addon.name} (+${addon.price.toFixed(2)})
              </span>
              <input
                type="checkbox"
                checked={selectedAddons.some((a) => a.id === addon.id)}
                onChange={() => toggleAddon(addon)}
              />
            </label>
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
