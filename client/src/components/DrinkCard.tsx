// src/components/DrinkCard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { OrderItem } from "@shared/schema";
import { addOnOptions } from "@/data/menuData";

interface Drink {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  images: {
    hot?: string;
    iced?: string;
    apple?: string;
    pineapple?: string;
  };
}

interface DrinkCardProps {
  drink: Drink;
  addOns: { id: string; name: string; price: number }[];
  onAddToOrder: (
    drinkId: string,
    temperature: "hot" | "iced" | "apple" | "pineapple",
    quantity: number,
    addOns: string[]
  ) => void;
}

export default function DrinkCard({ drink, addOns, onAddToOrder }: DrinkCardProps) {
  const [selectedTemperature, setSelectedTemperature] = useState<
    "hot" | "iced" | "apple" | "pineapple"
  >(drink.images.iced ? "iced" : "hot");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleAddToOrder = () => {
    onAddToOrder(drink.id, selectedTemperature, quantity, selectedAddOns);
    setQuantity(1);
    setSelectedAddOns([]);
  };

  const isEmpanada = drink.id === "empanadas";

  return (
    <div className="border rounded-lg p-4 flex flex-col">
      {/* Imagen */}
      <img
        src={
          isEmpanada
            ? selectedTemperature === "apple"
              ? drink.images.apple
              : drink.images.pineapple
            : selectedTemperature === "hot"
            ? drink.images.hot
            : drink.images.iced
        }
        alt={drink.name}
        className="w-full h-40 object-cover rounded"
      />

      {/* Nombre y descripción */}
      <h3 className="mt-2 text-lg font-serif font-semibold">{drink.name}</h3>
      <p className="text-sm text-gray-600">{drink.description}</p>

      {/* Selector Hot/Iced o Apple/Pineapple */}
      <div className="flex space-x-2 mt-2">
        {isEmpanada ? (
          <>
            <button
              type="button"
              className={`px-3 py-1 rounded ${
                selectedTemperature === "apple"
                  ? "bg-[#1D9099] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedTemperature("apple")}
            >
              Apple
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded ${
                selectedTemperature === "pineapple"
                  ? "bg-[#1D9099] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedTemperature("pineapple")}
            >
              Pineapple
            </button>
          </>
        ) : (
          <>
            {drink.images.hot && (
              <button
                type="button"
                className={`px-3 py-1 rounded ${
                  selectedTemperature === "hot"
                    ? "bg-[#1D9099] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedTemperature("hot")}
              >
                Hot
              </button>
            )}
            {drink.images.iced && (
              <button
                type="button"
                className={`px-3 py-1 rounded ${
                  selectedTemperature === "iced"
                    ? "bg-[#1D9099] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedTemperature("iced")}
              >
                Iced
              </button>
            )}
          </>
        )}
      </div>

      {/* Quantity */}
      {!isEmpanada && (
        <div className="flex items-center space-x-2 mt-2">
          <label className="text-sm">Qty:</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1"
          />
        </div>
      )}

      {/* Add-ons */}
      {!isEmpanada && (
        <div className="mt-3">
          <p className="text-sm font-medium">Customize your drink:</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {addOns.map((addOn) => (
              <label
                key={addOn.id}
                className="flex items-center space-x-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedAddOns.includes(addOn.id)}
                  onChange={() => toggleAddOn(addOn.id)}
                />
                <span>
                  {addOn.name} (+${addOn.price.toFixed(2)})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Add to Order Button */}
      <div className="mt-4">
        {isEmpanada ? (
          <Button disabled className="w-full bg-gray-400 text-white">
            Coming Soon
          </Button>
        ) : (
          <Button
            onClick={handleAddToOrder}
            className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white"
          >
            Add to Order - ${drink.basePrice.toFixed(2)}
          </Button>
        )}
      </div>
    </div>
  );
}
