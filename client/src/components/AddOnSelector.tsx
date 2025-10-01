import React, { useEffect, useState } from "react";

interface AddOn {
  id: string;
  name: string;
  description?: string;
  price: number;
}

interface AddOnSelectorProps {
  onAddOnSelect: (selectedAddOns: AddOn[]) => void;
}

export default function AddOnSelector({ onAddOnSelect }: AddOnSelectorProps) {
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [showAddOns, setShowAddOns] = useState(false);

  // ✅ Cargar add-ons desde Airtable (Netlify Function)
  useEffect(() => {
    fetch("/.netlify/functions/addons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAddons(data);
      })
      .catch((err) => console.error("Error fetching addons:", err));
  }, []);

  // ✅ Notificar al padre cada vez que cambia la selección
  useEffect(() => {
    onAddOnSelect(selectedAddOns);
  }, [selectedAddOns]);

  const toggleAddOn = (addon: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  return (
    <div className="mt-3 border-t border-gray-300 pt-3">
      {/* Checkbox principal */}
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          className="accent-green-600"
          checked={showAddOns}
          onChange={(e) => setShowAddOns(e.target.checked)}
        />
        Customize your drink
      </label>

      {/* Lista desplegable de Add-ons */}
      {showAddOns && (
        <div className="mt-2 space-y-2 animate-fadeIn">
          {addons.length > 0 ? (
            addons.map((addon) => (
              <div
                key={addon.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold">{addon.name}</p>
                  {addon.description && (
                    <p className="text-xs text-gray-500">{addon.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    ${addon.price.toFixed(2)}
                  </span>
                  <input
                    type="checkbox"
                    className="accent-green-600"
                    checked={selectedAddOns.some((a) => a.id === addon.id)}
                    onChange={() => toggleAddOn(addon)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">No add-ons available</p>
          )}
        </div>
      )}
    </div>
  );
}
