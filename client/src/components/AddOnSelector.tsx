import React, { useEffect, useState } from "react";

interface AddOn {
  id: string;
  name: string;
  price: number;
  active?: boolean;
  description?: string;
}

interface AddOnSelectorProps {
  onSelect: (addons: AddOn[]) => void;
}

export default function AddOnSelector({ onSelect }: AddOnSelectorProps) {
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);

  // ✅ Cargar AddOns desde Airtable
  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const response = await fetch("/.netlify/functions/addons");
        const data = await response.json();
        setAddons(data.filter((a: AddOn) => a.active !== false));
      } catch (error) {
        console.error("Error fetching addons:", error);
      }
    };
    fetchAddons();
  }, []);

  const toggleAddon = (addon: AddOn) => {
    let updated: AddOn[];

    if (selectedAddons.some((a) => a.id === addon.id)) {
      updated = selectedAddons.filter((a) => a.id !== addon.id);
    } else {
      updated = [...selectedAddons, addon];
    }

    setSelectedAddons(updated);
    onSelect(updated);
  };

  if (addons.length === 0) {
    return (
      <p className="text-sm text-gray-500 ml-4">
        No add-ons available right now.
      </p>
    );
  }

  return (
    <div className="ml-4 border-l pl-4 mb-3">
      {addons.map((addon) => (
        <label key={addon.id} className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={selectedAddons.some((a) => a.id === addon.id)}
            onChange={() => toggleAddon(addon)}
          />
          <span className="text-sm text-gray-700">
            {addon.name} (+${addon.price.toFixed(2)})
          </span>
        </label>
      ))}
    </div>
  );
}
