// src/components/DrinkCard.tsx
import { useState } from "react";
import type { DrinkOption } from "@/data/menuData";
import { addOnOptions } from "@/data/menuData";
import { Button } from "@/components/ui/button";

type Props = {
  drink: DrinkOption;
  onAddToOrder: (drinkId: string, temperature: "hot" | "iced", quantity: number, addOns: string[]) => void;
};

export default function DrinkCard({ drink, onAddToOrder }: Props) {
  const [temperature, setTemperature] = useState<"hot" | "iced">(
    drink.onlyHot ? "hot" : "hot"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [openCustomize, setOpenCustomize] = useState<boolean>(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="border rounded-xl p-4 flex flex-col gap-3 bg-card">
      <img
        src={temperature === "hot" || !drink.images.iced ? drink.images.hot : drink.images.iced!}
        alt={`${drink.name} ${temperature}`}
        className="w-full h-48 object-cover rounded-lg"
      />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{drink.name}</h3>
        <span className="text-sm text-muted-foreground">${drink.basePrice.toFixed(2)}</span>
      </div>

      <p className="text-sm text-muted-foreground">{drink.description}</p>

      {/* Hot / Iced */}
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded border ${
            temperature === "hot"
              ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
              : "bg-white text-foreground"
          }`}
          onClick={() => setTemperature("hot")}
        >
          Hot
        </button>
        <button
          className={`px-3 py-1 rounded border ${
            drink.onlyHot
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : temperature === "iced"
                ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
                : "bg-white text-foreground"
          }`}
          onClick={() => !drink.onlyHot && setTemperature("iced")}
          disabled={!!drink.onlyHot}
        >
          Iced
        </button>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Qty</span>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
          className="w-20 border rounded px-2 py-1"
        />
      </div>

      {/* Customize toggle */}
      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={openCustomize}
          onChange={(e) => setOpenCustomize(e.target.checked)}
        />
        <span>Customize your drink</span>
      </label>

      {/* Add-ons (collapsible) */}
      {openCustomize && (
        <div className="border rounded p-3 space-y-2">
          {addOnOptions.map((a) => (
            <label key={a.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedAddOns.includes(a.id)}
                  onChange={() => handleToggleAddOn(a.id)}
                />
                <span>{a.name}</span>
              </div>
              <span className="text-muted-foreground">${a.price.toFixed(2)}</span>
            </label>
          ))}
        </div>
      )}

      <Button
        onClick={() => onAddToOrder(drink.id, temperature, quantity, selectedAddOns)}
        className="w-full h-10 bg-[#1D9099] hover:bg-[#00454E] text-white"
      >
        Add to order
      </Button>
    </div>
  );
}
