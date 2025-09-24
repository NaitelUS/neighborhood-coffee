import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";

type VariantKey = string;

type MenuItemProps = {
  item: {
    name: string;
    variants: Record<
      VariantKey,
      {
        description: string;
        image: string;
        price: number;
      }
    >;
    addOns?: { name: string; price: number }[];
  };
};

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();

  // Tomamos la primera variante como default (ej: hot o apple)
  const [variant, setVariant] = useState<VariantKey>(
    Object.keys(item.variants)[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<
    { name: string; price: number }[]
  >([]);

  const variantData = item.variants[variant];

  const toggleAddOn = (addOn: { name: string; price: number }) => {
    if (selectedAddOns.find((a) => a.name === addOn.name)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addOn.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const handleAddToCart = () => {
    addItem({
      name: item.name,
      variant,
      price: variantData.price,
      quantity,
      addOns: selectedAddOns,
    });
    setQuantity(1);
    setSelectedAddOns([]);
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4 flex flex-col">
      <img
        src={variantData.image}
        alt={`${item.name} ${variant}`}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h3 className="text-lg font-semibold">{item.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{variantData.description}</p>

      {/* Variantes dinámicas */}
      <div className="flex gap-2 mb-3">
        {Object.keys(item.variants).map((key) => (
          <button
            key={key}
            onClick={() => setVariant(key)}
            className={`px-3 py-1 text-sm rounded ${
              variant === key
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Add-ons */}
      {item.addOns && item.addOns.length > 0 && (
        <div className="mb-3">
          <p className="font-semibold text-sm mb-1">Add-ons</p>
          <div className="flex flex-wrap gap-2">
            {item.addOns.map((add, i) => (
              <button
                key={i}
                onClick={() => toggleAddOn(add)}
                className={`px-2 py-1 text-xs rounded border ${
                  selectedAddOns.find((a) => a.name === add.name)
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700"
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
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>

      {/* Botón agregar */}
      <button
        onClick={handleAddToCart}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
      >
        Add to Order — ${(variantData.price * quantity).toFixed(2)}
      </button>
    </div>
  );
};

export default MenuItem;
