import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { OrderItem } from "@shared/schema";

interface DrinkCardProps {
  drink: {
    id: string;
    name: string;
    basePrice: number;
    description: string;
    images: { hot?: string; iced?: string };
  };
  addOns: { id: string; name: string; price: number }[];
  onAddToOrder: (
    drinkId: string,
    temperature: "hot" | "iced",
    quantity: number,
    addOns: string[]
  ) => void;
}

export default function DrinkCard({ drink, addOns, onAddToOrder }: DrinkCardProps) {
  const [temperature, setTemperature] = useState<"hot" | "iced">(
    drink.images.hot ? "hot" : "iced"
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showAddOns, setShowAddOns] = useState(false);

  const handleAddToOrder = () => {
    onAddToOrder(drink.id, temperature, quantity, selectedAddOns);
    setQuantity(1);
    setSelectedAddOns([]);
    setShowAddOns(false);
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col">
      {/* Image */}
      <img
        src={drink.images[temperature]}
        alt={drink.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />

      {/* Name */}
      <h3 className="text-lg font-serif font-semibold">{drink.name}</h3>
      <p className="text-sm text-muted-foreground mb-2">{drink.description}</p>

      {/* Hot/Iced toggle */}
      <div className="flex gap-2 mb-3">
        {drink.images.hot && (
          <Button
            type="button"
            variant={temperature === "hot" ? "default" : "outline"}
            onClick={() => setTemperature("hot")}
            className={`flex-1 ${
              temperature === "hot"
                ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
                : "text-black"
            }`}
          >
            Hot
          </Button>
        )}
        {drink.images.iced && (
          <Button
            type="button"
            variant={temperature === "iced" ? "default" : "outline"}
            onClick={() => setTemperature("iced")}
            className={`flex-1 ${
              temperature === "iced"
                ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
                : "text-black"
            }`}
          >
            Iced
          </Button>
        )}
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm">Qty:</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-16 border rounded-md text-center"
        />
      </div>

      {/* Customize checkbox */}
      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={showAddOns}
            onCheckedChange={(checked) => setShowAddOns(!!checked)}
          />
          <span className="text-sm font-medium">Customize your drink</span>
        </label>

        {showAddOns && (
          <div className="mt-2 space-y-2">
            {addOns.map((addOn) => (
              <label
                key={addOn.id}
                className="flex items-center justify-between text-sm cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedAddOns.includes(addOn.id)}
                    onCheckedChange={() => toggleAddOn(addOn.id)}
                  />
                  <span>{addOn.name}</span>
                </div>
                <span className="text-muted-foreground">+${addOn.price.toFixed(2)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Add to order */}
      <Button
        type="button"
        onClick={handleAddToOrder}
        className="mt-auto w-full bg-[#1D9099] hover:bg-[#00454E] text-white"
      >
        Add to Order - ${(drink.basePrice * quantity).toFixed(2)}
      </Button>
    </div>
  );
}
