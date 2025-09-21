import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { OrderItem } from "@shared/schema";

export default function DrinkCard({ drink, addOns, onAddToOrder }: any) {
  const [temperature, setTemperature] = useState<"hot" | "iced">("hot");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  return (
    <div className="border rounded-lg p-4 shadow">
      <h3 className="font-serif text-lg">{drink.name}</h3>
      <p>${drink.basePrice.toFixed(2)}</p>

      {/* Switch Hot/Iced */}
      <div className="flex gap-2 my-2">
        <Button
          onClick={() => setTemperature("hot")}
          className={`flex-1 ${
            temperature === "hot"
              ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
              : "bg-gray-200"
          }`}
        >
          Hot
        </Button>
        <Button
          onClick={() => setTemperature("iced")}
          className={`flex-1 ${
            temperature === "iced"
              ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
              : "bg-gray-200"
          }`}
        >
          Iced
        </Button>
      </div>

      {/* Quantity */}
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border p-2 rounded w-20"
      />

      {/* Add to order */}
      <Button
        onClick={() => onAddToOrder(drink.id, temperature, quantity, selectedAddOns)}
        className="w-full mt-2 bg-[#1D9099] hover:bg-[#00454E] text-white"
      >
        Add to Order
      </Button>
    </div>
  );
}
