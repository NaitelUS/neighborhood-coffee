import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";

type AddOn = {
  name: string;
  price: number;
};

type MenuItemProps = {
  name: string;
  description: string;
  price: number;
  image: string;
  variants?: string[]; // Hot / Iced, Apple / Pineapple, etc.
  addOns?: AddOn[];
};

export default function MenuItem({
  name,
  description,
  price,
  image,
  variants,
  addOns,
}: MenuItemProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    variants && variants.length > 0 ? variants[0] : undefined
  );
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);

  const toggleAddOn = (addOn: AddOn) => {
    if (selectedAddOns.find((a) => a.name === addOn.name)) {
      setSelectedAddOns((prev) => prev.filter((a) => a.name !== addOn.name));
    } else {
      setSelectedAddOns((prev) => [...prev, addOn]);
    }
  };

  const handleAddToCart = () => {
    const item = {
      name,
      description,
      price,
      image,
      quantity,
      variant: selectedVariant,
      addOns: selectedAddOns,
    };
    addItem(item);
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <p className="font-semibold mb-2">${price.toFixed(2)}</p>

        {/* Variantes */}
        {variants && variants.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Options:</p>
            <div className="flex gap-2">
              {variants.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-1 border rounded ${
                    selectedVariant === v
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons */}
        {addOns && addOns.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Add-ons:</p>
            <div className="flex flex-wrap gap-2">
              {addOns.map((add) => (
                <button
                  key={add.name}
                  onClick={() => toggleAddOn(add)}
                  className={`px-2 py-1 text-xs border rounded ${
                    selectedAddOns.find((a) => a.name === add.name)
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {add.name} (+${add.price.toFixed(2)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cantidad */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-2 py-1 border rounded"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-2 py-1 border rounded"
          >
            +
          </button>
        </div>

        {/* Botón */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded"
        >
          Add to Order
        </button>
      </div>
    </div>
  );
}
