import { useState } from "react";
import { useCart } from "@/hooks/useCart";

interface MenuItemProps {
  name: string;
  descriptionHot?: string;
  descriptionIced?: string;
  description?: string;
  price: number;
  imageHot?: string;
  imageIced?: string;
  image?: string;
  variants?: string[];
  addOns?: { name: string; price: number }[];
  type?: "drink" | "empanada";
}

export default function MenuItem({
  name,
  descriptionHot,
  descriptionIced,
  description,
  price,
  imageHot,
  imageIced,
  image,
  variants,
  addOns,
  type = "drink",
}: MenuItemProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    type === "drink" ? "Hot" : variants?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<
    { name: string; price: number }[]
  >([]);

  const toggleAddOn = (addOn: { name: string; price: number }) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.name === addOn.name)
        ? prev.filter((a) => a.name !== addOn.name)
        : [...prev, addOn]
    );
  };

  const handleAddToCart = () => {
    const item = {
      name,
      description:
        selectedVariant === "Hot"
          ? descriptionHot ?? description
          : selectedVariant === "Iced"
          ? descriptionIced ?? description
          : description,
      price,
      image:
        selectedVariant === "Hot"
          ? imageHot ?? image ?? ""
          : selectedVariant === "Iced"
          ? imageIced ?? image ?? ""
          : image ?? "",
      quantity,
      variant: selectedVariant,
      addOns: selectedAddOns,
    };
    addToCart(item);
    setQuantity(1);
    setSelectedAddOns([]);
  };

  return (
    <div className="border rounded p-4 bg-white shadow">
      <h3 className="font-bold text-lg">{name}</h3>

      {/* Imagen */}
      {selectedVariant === "Hot" && imageHot && (
        <img
          src={imageHot}
          alt={`${name} Hot`}
          className="w-32 h-32 object-cover rounded my-2"
        />
      )}
      {selectedVariant === "Iced" && imageIced && (
        <img
          src={imageIced}
          alt={`${name} Iced`}
          className="w-32 h-32 object-cover rounded my-2"
        />
      )}
      {!["Hot", "Iced"].includes(selectedVariant ?? "") && image && (
        <img
          src={image}
          alt={name}
          className="w-32 h-32 object-cover rounded my-2"
        />
      )}

      {/* Descripción */}
      <p className="text-sm text-gray-600 mb-2">
        {selectedVariant === "Hot"
          ? descriptionHot ?? description
          : selectedVariant === "Iced"
          ? descriptionIced ?? description
          : description}
      </p>

      {/* Variantes */}
      {variants && variants.length > 0 && (
        <div className="mb-2">
          <span className="text-sm font-medium block mb-1">Choose:</span>
          <div className="flex gap-2">
            {variants.map((variant) => (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={`px-2 py-1 border rounded text-sm ${
                  selectedVariant === variant
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons */}
      {addOns && addOns.length > 0 && (
        <div className="mb-2">
          <span className="text-sm font-medium block mb-1">Add-ons:</span>
          <div className="flex flex-wrap gap-2">
            {addOns.map((addOn, index) => (
              <button
                key={index}
                onClick={() => toggleAddOn(addOn)}
                className={`px-2 py-1 border rounded text-xs ${
                  selectedAddOns.find((a) => a.name === addOn.name)
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {addOn.name} (+${addOn.price.toFixed(2)})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cantidad */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>

      {/* Botón Add to Order */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-emerald-600 text-white py-1 rounded hover:bg-emerald-700"
      >
        Add to Order
      </button>
    </div>
  );
}
