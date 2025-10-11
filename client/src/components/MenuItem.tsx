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
    category?: string;
  };
}

export default function MenuItem({ product }: MenuItemProps) {
  const { addToCart } = useContext(CartContext);

  const [selectedOption, setSelectedOption] = useState<string>(
    product.is_hot ? "Hot" : product.is_iced ? "Iced" : ""
  );
  const [customize, setCustomize] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  const totalPrice =
    product.price + selectedAddOns.reduce((sum, a) => sum + a.price, 0);

  const isPastry = product.category?.toLowerCase() === "pastry";

  const handleAddToCart = () => {
    if (isPastry) return;

    if (!selectedOption && !isPastry) {
      alert("Please select Hot or Iced before adding to your order.");
      return;
    }

    const itemName = isPastry
      ? product.name
      : `${product.name} (${selectedOption})`;

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
    });

    alert(`${itemName} added to your order!`);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all">
      {/* Imagen */}
      <img
        src={product.image_url || "/attached_assets/tnclogo.png"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />

      {/* Nombre y descripción */}
      <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
      <p className="text-sm text-gray-600 mb-2">
        {product.description || "Delicious item from our menu"}
      </p>

      {/* 🥐 Coming Soon */}
      {isPastry && (
        <p className="text-sm text-[#1D9099] font-medium mb-3">
          🥐 Coming Soon
        </p>
      )}

      {/* Hot/Iced solo si no es empanada */}
      {!isPastry && (
        <div className="flex gap-2 mb-3">
          {product.is_hot && (
            <button
              onClick={() => setSelectedOption("Hot")}
              className={`px-3 py-1 rounded-md border ${
                selectedOption === "Hot"
                  ? "bg-[#1D9099] text-white border-[#00454E]"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-[#e0f7f8]"
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
                  ? "bg-[#1D9099] text-white border-[#00454E]"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-[#e0f7f8]"
              }`}
            >
              Iced
            </button>
          )}
        </div>
      )}

      {/* Customize solo bebidas */}
      {!isPastry && (
        <>
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={customize}
              onChange={(e) => setCustomize(e.target.checked)}
            />
            <span className="font-medium">Customize your drink</span>
          </label>

          {customize && (
            <AddOnSelector
              onSelect={(addons) => {
                setSelectedAddOns(addons);
              }}
            />
          )}
        </>
      )}

      {/* Total + botón */}
      <div className="mt-3 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-800">
          ${totalPrice.toFixed(2)}
        </span>

        <button
          onClick={handleAddToCart}
          disabled={isPastry}
          className={`px-4 py-2 rounded-md font-medium ${
            isPastry
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#1D9099] text-white hover:bg-[#00454E]"
          }`}
        >
          {isPastry ? "Coming Soon" : "Add to Order"}
        </button>
      </div>
    </div>
  );
}
