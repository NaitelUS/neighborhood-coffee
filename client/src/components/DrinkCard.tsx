import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { OrderItem } from "@shared/schema";

interface Drink {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  hotImg: string;
  icedImg?: string;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface DrinkCardProps {
  drink: Drink;
  addOns: AddOn[];
  onAddToOrder: (
    drinkId: string,
    temperature: "hot" | "iced",
    quantity: number,
    addOns: string[]
  ) => void;
}

export default function DrinkCard({
  drink,
  addOns,
  onAddToOrder,
}: DrinkCardProps) {
  const [temperature, setTemperature] = useState<"hot" | "iced">("hot");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  return (
    <div className="border rounded-lg shadow p-4 flex flex-col gap-3 bg-white">
      {/* Imagen */}
      <img
        src={temperature === "hot" ? drink.hotImg : drink.icedImg || drink.hotImg}
        alt={drink.name}
        className="w-full h-40 object-cover rounded"
      />

      {/* Nombre y descripción */}
      <h3 className="text-lg font-serif font-semibold">{drink.name}</h3>
      <p className="text-sm text-gray-600">{drink.description}</p>
      <p className="font-medium">Base Price: ${drink.basePrice.toFixed(2)}</p>

      {/* Selector Hot/Iced */}
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => setTemperature("hot")}
          className={`flex-1 ${
            temperature === "hot"
              ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Hot
        </Button>
        <Button
          type="button"
          disabled={!drink.icedImg}
          onClick={() => setTemperature("iced")}
          className={`flex-1 ${
            temperature === "iced"
              ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Iced
        </Button>
      </div>

      {/* Add-ons */}
      <div className="space-y-1">
        <h4 className="font-medium">Customize your drink:</h4>
        {addOns.map((addOn) => (
          <label key={addOn.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedAddOns.includes(addOn.id)}
              onChange={() => toggleAddOn(addOn.id)}
            />
            {addOn.name} (+${addOn.price.toFixed(2)})
          </label>
        ))}
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <label className="text-sm">Qty:</label>
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border w-16 rounded px-2 py-1 text-center"
        />
      </div>

      {/* Add to order */}
      <Button
        onClick={() => onAddToOrder(drink.id, temperature, quantity, selectedAddOns)}
        className="bg-[#1D9099] hover:bg-[#00454E] text-white w-full"
      >
        Add to Order
      </Button>
    </div>
  );
}
