// src/components/AddOnSelector.tsx

interface AddOnSelectorProps {
  addOns: { id: string; name: string; price: number }[];
  selectedAddOns: string[];
  toggleAddOn: (id: string) => void;
}

export default function AddOnSelector({
  addOns,
  selectedAddOns,
  toggleAddOn,
}: AddOnSelectorProps) {
  return (
    <div className="mt-2 space-y-1">
      {addOns.map((addOn) => (
        <label key={addOn.id} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={selectedAddOns.includes(addOn.id)}
            onChange={() => toggleAddOn(addOn.id)}
          />
          {addOn.name} (+${addOn.price.toFixed(2)})
        </label>
      ))}
    </div>
  );
}
