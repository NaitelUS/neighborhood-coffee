import React, { useEffect, useState } from "react";

interface AddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface AddOnSelectorProps {
  onSelect: (selectedAddOns: AddOn[]) => void;
}

export default function AddOnSelector({ onSelect }: AddOnSelectorProps) {
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar Add-ons desde Airtable
  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const res = await fetch("/.netlify/functions/addons");
        const data = await res.json();
        setAddons(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error loading Add-ons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddons();
  }, []);

  // 🔹 Avisar al padre cuando cambien los Add-ons seleccionados
  useEffect(() => {
    onSelect(selectedAddOns);
  }, [selectedAddOns]);

  // 🔹 Maneja selección
  const toggleAddOn = (addon: AddOn) => {
    setSelectedAddOns((prev) => {
      const alreadySelected = prev.find((a) => a.id === addon.id);
      if (alreadySelected) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  if (loading) return <p className="text-sm text-gray-500">Loading add-ons...</p>;

  if (addons.length === 0) {
    return <p className="text-sm text-gray-500">No add-ons available.</p>;
  }

  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <p className="font-semibold text-gray-700 mb-2">Select Add-ons:</p>

      <ul className="space-y-2">
        {addons.map((addon) => (
          <li key={addon.id} className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={selectedAddOns.some((a) => a.id === addon.id)}
                onChange={() => toggleAddOn(addon)}
              />
              <span>
                {addon.name}
                {addon.description && (
                  <span className="text-gray-500 text-xs ml-1">
                    ({addon.description})
                  </span>
                )}
              </span>
            </label>
            <span className="text-sm font-medium text-gray-700">
              +${addon.price.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
