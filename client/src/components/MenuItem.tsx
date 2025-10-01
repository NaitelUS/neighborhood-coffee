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

  const handleAddToCart = () => {
    if (
      product.category?.toLowerCase() !== "pastry" && // 🥐 Empanadas no necesitan Hot/Iced
      !selectedOption
    ) {
      alert("Please select Hot or Iced before adding to your order.");
      return;
    }

    const itemName =
      product.category?.toLowerCase() === "pastry"
        ? product.name
        : `${product.name} (${selectedOption})`;

    addToCart({
      id: product.id,
      name: itemName,
      price: totalPrice,
      option: selectedOption,
      addons:
        product.category?.toLowerCase() !== "pastry"
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

      {/* ⚠️ Coming Soon para Empanadas */}
      {product.category?.toLowerCase() === "pastry" && (
        <p className="text-sm text-amber-600 font-medium mb-2">
          🥐 Coming Soon
        </p>
      )}

      {/* Hot/Iced solo si no es empanada */}
      {product.category?.toLowerCase() !== "pastry" && (
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
      )}

      {/* Customize (solo bebidas) */}
      {product.category?.toLowerCase() !== "pastry" && (
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

      {/* Total dinámico + botón */}
      <div className="mt-3 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-800">
          ${totalPrice.toFixed(2)}
        </span>
        <button
          onClick={handleAddToCart}
          className={`px-4 py-2 rounded-md font-medium bg-amber-600 text-white hover:bg-amber-700`}
        >
          Add to Order
        </button>
      </div>
    </div>
  );
}
