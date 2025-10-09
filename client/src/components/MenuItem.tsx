import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import AddOnSelector from "@/components/AddOnSelector";

export default function MenuItem({ product }) {
  const cart = useContext(CartContext);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);

  if (!cart) return null;

  const handleAddToCart = () => {
    cart.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      addOns: selectedAddOns,
      quantity,
    });
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-3">${product.price.toFixed(2)}</p>

      {product.addOns?.length > 0 && (
        <AddOnSelector
          addOns={product.addOns}
          selectedAddOns={selectedAddOns}
          onChange={setSelectedAddOns}
        />
      )}

      <div className="flex items-center gap-2 mt-3">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded px-2 py-1 w-16 text-center"
        />
        <button
          onClick={handleAddToCart}
          className="bg-[#00454E] text-white px-4 py-2 rounded hover:bg-[#006067] transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
