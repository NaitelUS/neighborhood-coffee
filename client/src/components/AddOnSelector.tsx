import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { addOnOptions } from "@/data/menuData";

interface AddOnSelectorProps {
  selectedAddOns: string[];
  onChange: (addOns: string[]) => void;
}

export default function AddOnSelector({
  selectedAddOns,
  onChange,
}: AddOnSelectorProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      onChange(selectedAddOns.filter((a) => a !== id));
    } else {
      onChange([...selectedAddOns, id]);
    }
  };

  return (
    <div className="border rounded-lg p-3">
      {/* Toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full font-medium text-sm text-left"
      >
        <span>☑ Customize your drink</span>
        <span>{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {addOnOptions.map((addOn) => (
            <div key={addOn.id} className="flex items-center space-x-2">
              <Checkbox
                id={addOn.id}
                checked={selectedAddOns.includes(addOn.id)}
                onCheckedChange={() => toggleAddOn(addOn.id)}
              />
              <Label htmlFor={addOn.id} className="flex-1">
                {addOn.name}
              </Label>
              <span className="text-sm text-muted-foreground">
                +${addOn.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
