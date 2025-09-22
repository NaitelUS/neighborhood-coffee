// src/components/DrinkCard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddOnSelector from "@/components/AddOnSelector";
import type { OrderItem } from "@shared/schema";

interface DrinkCardProps {
  drink: any;
  addOns: { id: string; name: string; price: number }[];
  onAddToOrder: (
    drinkId: string,
    temperature: "hot" | "iced",
    quantity: number,
    addOns: string[]
  ) => void;
}

export default function DrinkCard({ drink, addOns, onAddToOrder }: DrinkCardProps) {
  const [temperature, setTemperature] = useState<"hot" | "iced">("hot");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showAddOns, setShowAddOns] = useState(false);

  const handleAddToOrder = () => {
    if (!drink.comingSoon) {
      onAddToOrder(drink.id, temperature, quantity, selectedAddOns);
    }
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const imageSrc =
    drink.images?.[temperature] || drink.images?.hot || "/attached_assets/placeholder.png";

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col">
      <img
        src={imageSrc}
        alt={drink.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="mt-3 text-lg font-semibold">{drink.name}</h3>
      <p className="text-sm text-muted-foreground">{drink.description}</p>
      <p className="mt-2 font-bold">${drink.basePrice.toFixed(2)}</p>

      {/* Opciones Hot/Iced o Apple/Pineapple */}
      {drink.options ? (
        <div className="flex gap-2 mt-3">
          {drink.options.map((opt: string) => (
            <Button
              key={opt}
              className="flex-1 bg-[#1D9099] hover:bg-[#00454E] text-white"
              disabled={drink.comingSoon}
            >
              {opt}
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex gap-2 mt-3">
          <Button
            className={`flex-1 ${
              temperature === "hot" ? "bg-[#1D9099] text-white" : "bg-gray-200 text-black"
            }`}
            onClick={() => setTemperature("hot")}
          >
            Hot
          </Button>
          <Button
            className={`flex-1 ${
              temperature === "iced" ? "bg-[#1D9099] text-white" : "bg-gray-200 text-black"
            }`}
            onClick={() => setTemperature("iced")}
            disabled={!drink.images?.iced}
          >
            Iced
          </Button>
        </div>
      )}

      {/* Quantity */}
      {!drink.comingSoon && (
        <div className="flex items-center gap-2 mt-3">
          <input
            type="number"
            value={quantity}
            min={1}
            className="w-16 border rounded text-center"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
      )}

      {/* Customize Add-ons */}
      <div className="mt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAddOns}
            onChange={() => setShowAddOns(!showAddOns)}
          />
          <span className="text-sm font-medium">Customize your drink</span>
        </label>
        {showAddOns && (
          <AddOnSelector
            addOns={addOns}
            selectedAddOns={selectedAddOns}
            toggleAddOn={toggleAddOn}
          />
        )}
      </div>

      {/* Add to Order */}
      <Button
        className="mt-4 w-full bg-[#1D9099] hover:bg-[#00454E] text-white"
        onClick={handleAddToOrder}
        disabled={drink.comingSoon}
      >
        {drink.comingSoon ? "Coming Soon" : `Add to Order - $${drink.basePrice.toFixed(2)}`}
      </Button>
    </div>
  );
}
