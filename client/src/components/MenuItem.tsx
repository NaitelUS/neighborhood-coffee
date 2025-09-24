// client/src/components/MenuItem.tsx
import { useState } from "react";
import { MenuItem as Item, addOnOptions } from "@/data/menuData";
import { useCart } from "@/hooks/useCart";

interface Props {
  item: Item;
}

export default function MenuItem({ item }: Props) {
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState(
    item.options ? item.options[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const handleAddOnChange = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    addToCart({
      ...item,
      option: selectedOption,
      quantity,
      addOns: selectedAddOns,
    });
  };

  return (
    <div className="border rounded-lg shadow-sm p-4">
      <img
        src={`/attached_assets/${item.image}`}
        alt={item.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="font-semibold text-lg mt-2">{item.name}</h3>
      <p className="text-sm text-gray-600">{item.description}</p>
      <p className="font-bold mt-1">${item.price.toFixed(2)}</p>

      {item.options && (
        <div className="flex gap-2 mt-2">
          {item.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className={`px-3 py-1 rounded border ${
                selectedOption === opt ? "bg-teal-600 text-white" : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {item.id !== "golden" && item.id !== "empanada" && (
        <div className="mt-2">
          <p className="font-medium text-sm">Customize your drink:</p>
          {addOnOptions.map((a) => (
            <label key={a.id} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={selectedAddOns.includes(a.id)}
                onChange={() => handleAddOnChange(a.id)}
                className="mr-2"
              />
              {a.name} (+${a.price.toFixed(2)})
            </label>
          ))}
        </div>
      )}

      {item.id === "empanada" && (
        <div className="mt-2 text-sm text-gray-700">
          Choose your flavor: {item.options?.join(" / ")}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-16 border rounded px-2 py-1"
        />
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-teal-600 text-white px-4 py-2 rounded"
        >
          Add to Order
        </button>
      </div>
    </div>
  );
}
