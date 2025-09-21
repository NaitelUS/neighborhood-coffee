import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddOnSelector from "@/components/AddOnSelector";
import type { OrderItem } from "@shared/schema";

interface Drink {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageHot: string;
  imageIced?: string;
  addOns: { id: string; name: string; price: number }[];
}

interface DrinkCardProps {
  drink: Drink;
  addOns: { id: string; name: string; price: number }[];
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
  const [showAddOns, setShowAddOns] = useState(false);

  const handleAdd = () => {
    onAddToOrder(drink.id, temperature, quantity, selectedAddOns);
    setQuantity(1);
    setSelectedAddOns([]);
    setShowAddOns(false);
  };

  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col">
      {/* Imagen */}
      <img
        src={
          temperature === "hot"
            ? `/attached_assets/${drink.imageHot}`
            : `/attached_assets/${drink.imageIced || drink.imageHot}`
        }
        alt={drink.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />

      {/* Nombre y descripción */}
      <h3 className="text-xl font-serif font-semibold">{drink.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{drink.description}</p>
      <p className="text-md font-bold mb-4">${drink.basePrice.toFixed(2)}</p>

      {/* Hot / Iced selector */}
      <div className="flex gap-2 mb-3">
        <Button
          type="button"
          onClick={() => setTemperature("hot")}
          className={
            temperature === "hot"
              ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
              : "bg-gray-200 text-black"
          }
        >
          Hot
        </Button>
        {drink.imageIced && (
          <Button
            type="button"
            onClick={() => setTemperature("iced")}
            className={
              temperature === "iced"
                ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
                : "bg-gray-200 text-black"
            }
          >
            Iced
          </Button>
        )}
      </div>

      {/* Customize Add-ons */}
      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAddOns}
            onChange={(e) => setShowAddOns(e.target.checked)}
          />
          <span>Customize your drink</span>
        </label>
        {showAddOns && (
          <div className="mt-2">
            <AddOnSelector
              addOns={addOns}
              selected={selectedAddOns}
              onChange={setSelectedAddOns}
            />
          </div>
        )}
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm">Qty:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-16 border rounded px-2 py-1"
        />
      </div>

      {/* Add to order */}
      <Button
        onClick={handleAdd}
        className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white"
      >
        Add to Order
      </Button>
    </div>
  );
}
