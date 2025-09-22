// src/components/DrinkCard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddOnSelector from "@/components/AddOnSelector";

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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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

  // Mostrar imagen dependiendo de la opción seleccionada
  let imageSrc = "/attached_assets/placeholder.png";
  if (drink.id === "empanada") {
    if (selectedOption === "Apple") {
      imageSrc = drink.images.apple;
    } else if (selectedOption === "Pineapple") {
      imageSrc = drink.images.pineapple;
    } else {
      imageSrc = drink.images.apple; // default a Apple
    }
  } else {
    imageSrc =
      drink.images?.[temperature] ||
      drink.images?.hot ||
      drink.images?.default ||
      "/attached_assets/placeholder.png";
  }

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col">
      <img src={imageSrc} alt={drink.name} className="w-full h-40 object-cover rounded" />
      <h3 className="mt-3 text-lg font-semibold">{drink.name}</h3>
      <p className="text-sm text-muted-foreground">{drink.description}</p>
      <p className="mt-2 font-bold">${drink.basePrice.toFixed(2)}</p>

      {/* Opciones de producto */}
      {drink.options && drink.options.length > 0 ? (
        <div className="flex gap-2 mt-3">
          {drink.options.map((opt: string) => (
            <Button
              key={opt}
              className={`flex-1 ${
                selectedOption === opt ? "bg-[#1D9099] text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => setSelectedOption(opt)}
            >
              {opt}
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex gap-2 mt-3">
          {drink.images?.hot && (
            <Button
              className={`flex-1 ${
                temperature === "hot" ? "bg-[#1D9099] text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => setTemperature("hot")}
            >
              Hot
            </Button>
          )}
          {drink.images?.iced && (
            <Button
              className={`flex-1 ${
                temperature === "iced" ? "bg-[#1D9099] text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => setTemperature("iced")}
            >
              Iced
            </Button>
          )}
        </div>
      )}

      {/* Cantidad (solo si no es coming soon) */}
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
      {!drink.comingSoon && (
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
      )}

      {/* Botón Add to Order */}
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
