import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

interface AddOn {
  name: string;
  price: number;
}

interface MenuItemProps {
  product: {
    name: string;
    price: number;
    hot_available?: boolean;
    iced_available?: boolean;
    image_url?: string;
  };
  addons?: AddOn[];
}

const MenuItem: React.FC<MenuItemProps> = ({ product, addons = [] }) => {
  const { addToCart } = useContext(CartContext);
  const [selectedOption, setSelectedOption] = useState("Hot");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [showCustomize, setShowCustomize] = useState(false);

  const toggleAddOn = (addon: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    const addonsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const basePrice = product.price;
    const totalPrice = basePrice + addonsTotal;

    const item = {
      name: `${product.name} (${selectedOption})`,
      option: selectedOption,
      price: totalPrice,
      basePrice: basePrice,
      includesAddons: true,
      addons: selectedAddOns,
      image_url: product.image_url,
    };

    addToCart(item);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center text-center">
      <img
        src={product.image_url || "/placeholder.png"}
        alt={product.name}
        className="w-24 h-24 object-cover mb-2 rounded-lg"
      />
      <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">${product.price.toFixed(2)}</p>

      <div className="flex justify-center space-x-2 mb-3">
        {product.hot_available && (
          <button
            onClick={() => setSelectedOption("Hot")}
            className={`px-3 py-1 rounded-full border ${
              selectedOption === "Hot"
                ? "bg-emerald-600 text-white"
                : "bg-white text-emerald-600"
            }`}
          >
            Hot
          </button>
        )}
        {product.iced_available && (
          <button
            onClick={() => setSelectedOption("Iced")}
            className={`px-3 py-1 rounded-full border ${
              selectedOption === "Iced"
                ? "bg-emerald-600 text-white"
                : "bg-white text-emerald-600"
            }`}
          >
            Iced
          </button>
        )}
      </div>

      <label className="text-sm font-medium text-emerald-700 cursor-pointer mb-2">
        <input
          type="checkbox"
          checked={showCustomize}
          onChange={() => setShowCustomize(!showCustomize)}
          className="mr-2 accent-emerald-600"
        />
        Customize your drink
      </label>

      {showCustomize && addons.length > 0 && (
        <div className="w-full mb-3 text-left">
          {addons.map((addon) => (
            <label
              key={addon.name}
              className="flex justify-between items-center py-1 text-sm text-gray-700"
            >
              <span>{addon.name}</span>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 text-xs">
                  (+${addon.price.toFixed(2)})
                </span>
                <input
                  type="checkbox"
                  checked={selectedAddOns.some((a) => a.name === addon.name)}
                  onChange={() => toggleAddOn(addon)}
                  className="accent-emerald-600"
                />
              </div>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-semibold mt-2 transition"
      >
        Add to order
      </button>
    </div>
  );
};

export default MenuItem;
