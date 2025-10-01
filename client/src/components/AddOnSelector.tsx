import React, { useEffect, useState } from "react";
import { fetchAddOns, AddOn } from "@/api/fetchAddOns";

interface AddOnSelectorProps {
  onSelect: (selected: AddOn[]) => void;
}

export default function AddOnSelector({ onSelect }: AddOnSelectorProps) {
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);

  useEffect(() => {
    fetchAddOns().then(setAddons);
  }, []);

  const handleToggle = (addon: AddOn) => {
    let updated: AddOn[];
    if (selectedAddons.some((a) => a.id === addon.id)) {
      updated = selectedAddons.filter((a) => a.id !== addon.id);
    } else {
      updated = [...selectedAddons, addon];
    }
    setSelectedAddons(updated);
    onSelect(updated);
  };

  return (
    <div className="border rounded-md p-4 bg-gray-50 mt-3">
      <p className="font-semibold mb-3 text-gray-800">Customize your drink 🍯</p>

      {addons.length === 0 ? (
        <p className="text-gray-500 text-sm">Loading add-ons...</p>
      ) : (
        <ul className="space-y-3">
          {addons.map((addon) => (
            <li
              key={addon.id}
              className="flex flex-col border-b pb-2 last:border-none"
            >
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAddons.some((a) => a.id === addon.id)}
                    onChange={() => handleToggle(addon)}
                  />
                  <span className="font-medium text-gray-700">{addon.name}</span>
                </label>
                <span className="text-sm text-green-700 font-semibold">
                  +${addon.price.toFixed(2)}
                </span>
              </div>

              {addon.description && (
                <p className="text-xs text-gray-500 pl-6 mt-1">
                  {addon.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
