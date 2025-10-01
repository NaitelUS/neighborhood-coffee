import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import AddOnSelector from "./AddOnSelector";
import { CartContext } from "@/context/CartContext";

export default function MenuItem({ product }) {
  const { addToCart } = useContext(CartContext);
  const [selectedOption, setSelectedOption] = useState("Hot");
  const [showAddons, setShowAddons] = useState(false);

  const handleAddToCart = () => {
    if (!selectedOption) return;
    addToCart({ ...product, option: selectedOption });
  };

  return (
    <div className="border rounded-2xl shadow-sm p-4 bg-white">
      <img
        src={product.image_url || "/attached_assets/tnclogo.png"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl mb-3"
      />

      <h2 className="font-semibold text-lg">{product.name}</h2>
      <p className="text-gray-600 mb-2">{product.description}</p>

      <div className="flex gap-3 mb-3">
        {product.is_hot && (
          <Button
            variant={selectedOption === "Hot" ? "default" : "outline"}
            onClick={() => setSelectedOption("Hot")}
          >
            Hot
          </Button>
        )}
        {product.is_iced && (
          <Button
            variant={selectedOption === "Iced" ? "default" : "outline"}
            onClick={() => setSelectedOption("Iced")}
          >
            Iced
          </Button>
        )}
      </div>

      <div className="mb-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={() => setShowAddons(!showAddons)}
            checked={showAddons}
          />
          Customize your drink
        </label>
      </div>

      {showAddons && (
        <div className="mt-3 border-t pt-3">
          <AddOnSelector productId={product.id} />
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <span className="font-bold">${product.price?.toFixed(2)}</span>
        <Button
          onClick={handleAddToCart}
          disabled={!selectedOption}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Add to Order
        </Button>
      </div>
    </div>
  );
}
