import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddOnSelector from "@/components/AddOnSelector";

interface DrinkCardProps {
  drink: {
    id: string;
    name: string;
    basePrice: number;
    description: string;
    images: {
      hot: string;
      iced?: string;
    };
  };
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

  const handleAdd = () => {
    onAddToOrder(drink.id, temperature, quantity, selectedAddOns);
    setQuantity(1);
    setSelectedAddOns([]);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col">
      {/* Imagen */}
      <img
        src={temperature === "hot" ? drink.images.hot : drink.images.iced || drink.images.hot}
        alt={drink.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />

      {/* Nombre y descripción */}
      <h3 className="text-lg font-serif font-semibold">{drink.name}</h3>
      <p className="text-sm text-muted-foreground mb-2">{drink.description}</p>
      <p className="font-semibold mb-3">${drink.basePrice.toFixed(2)}</p>

      {/* Botones Hot/Iced */}
      <div className="flex space-x-2 mb-3">
        <Button
          type="button"
          onClick={() => setTemperature("hot")}
          className={`flex-1 ${
            temperature === "hot"
              ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Hot
        </Button>
        {drink.images.iced && (
          <Button
            type="button"
            onClick={() => setTemperature("iced")}
            className={`flex-1 ${
              temperature === "iced"
                ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Iced
          </Button>
        )}
      </div>

      {/* Cantidad */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm">Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-16 border rounded px-2 py-1 text-center"
        />
      </div>

      {/* Customize your drink */}
      <AddOnSelector
        selectedAddOns={selectedAddOns}
        onChange={setSelectedAddOns}
      />

      {/* Botón de agregar */}
      <Button
        type="button"
        onClick={handleAdd}
        className="mt-4 w-full bg-[#1D9099] hover:bg-[#00454E] text-white"
      >
        Add to Order
      </Button>
    </div>
  );
}
