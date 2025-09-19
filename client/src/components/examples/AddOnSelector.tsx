import { useState } from 'react';
import AddOnSelector from '../AddOnSelector';

export default function AddOnSelectorExample() {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const sampleAddOns = [
    { id: 'extra-shot', name: 'Extra Espresso Shot', price: 0.75 },
    { id: 'oat-milk', name: 'Oat Milk', price: 0.65 },
    { id: 'vanilla-syrup', name: 'Vanilla Syrup', price: 0.50 },
    { id: 'caramel-syrup', name: 'Caramel Syrup', price: 0.50 },
  ];

  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    setSelectedAddOns(prev => 
      checked 
        ? [...prev, addOnId]
        : prev.filter(id => id !== addOnId)
    );
    console.log(`${checked ? 'Selected' : 'Deselected'} add-on: ${addOnId}`);
  };

  return (
    <div className="max-w-md">
      <AddOnSelector 
        addOns={sampleAddOns}
        selectedAddOns={selectedAddOns}
        onAddOnChange={handleAddOnChange}
      />
    </div>
  );
}