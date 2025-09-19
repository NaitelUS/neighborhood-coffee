import DrinkCard from '../DrinkCard';
import hotAmericanoImg from '@assets/generated_images/Hot_Americano_Coffee_511b6324.png';
import icedAmericanoImg from '@assets/generated_images/Iced_Americano_Coffee_57bcec89.png';

export default function DrinkCardExample() {
  const sampleDrink = {
    id: 'americano',
    name: 'Americano',
    description: 'Rich espresso shots with hot water, creating a smooth and bold coffee experience.',
    basePrice: 3.75,
    availableTemperatures: ['hot', 'iced'] as ('hot' | 'iced')[],
    images: {
      hot: hotAmericanoImg,
      iced: icedAmericanoImg,
    }
  };

  const sampleAddOns = [
    { id: 'extra-shot', name: 'Extra Espresso Shot', price: 0.75 },
    { id: 'oat-milk', name: 'Oat Milk', price: 0.65 },
    { id: 'vanilla-syrup', name: 'Vanilla Syrup', price: 0.50 },
  ];

  const handleAddToOrder = (drinkId: string, temperature: 'hot' | 'iced', quantity: number, addOns: string[]) => {
    console.log(`Added ${quantity}x ${temperature} ${drinkId} with add-ons: ${addOns.join(', ')}`);
  };

  return (
    <div className="max-w-sm">
      <DrinkCard drink={sampleDrink} addOns={sampleAddOns} onAddToOrder={handleAddToOrder} />
    </div>
  );
}