import { useState } from "react";

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface Props {
  addOns: AddOn[];
  selectedAddOns: string[];
  onChange: (addOns: string[]) => void;
}

export default function AddOnSelector({
  addOns,
  selectedAddOns,
  onChange,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      onChange(selectedAddOns.filter((a) => a !== id));
    } else {
      onChange([...selectedAddOns, id]);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={expanded}
          onChange={() => setExpanded(!expanded)}
        />
        <span className="font-medium">Customize your drink</span>
      </label>

      {expanded && (
        <div className="mt-3 space-y-2">
          {addOns.map((addOn) => (
            <label
              key={addOn.id}
              className="flex items-center justify-between cursor-pointer"
            >
              <div>
                <input
                  type="checkbox"
                  checked={selectedAddOns.includes(addOn.id)}
                  onChange={() => toggleAddOn(addOn.id)}
                />
                <span className="ml-2">{addOn.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                +${addOn.price.toFixed(2)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
