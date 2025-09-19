import OrderSummary from '../OrderSummary';

export default function OrderSummaryExample() {
  // todo: remove mock functionality
  const mockItems = [
    {
      drinkId: 'latte',
      drinkName: 'Latte',
      temperature: 'hot' as const,
      quantity: 2,
      basePrice: 4.50,
      addOns: ['oat-milk', 'vanilla-syrup'],
      totalPrice: 11.30,
    },
    {
      drinkId: 'americano',
      drinkName: 'Americano',
      temperature: 'iced' as const,
      quantity: 1,
      basePrice: 3.75,
      addOns: ['extra-shot'],
      totalPrice: 4.50,
    },
  ];

  const mockAddOns = [
    { id: 'extra-shot', name: 'Extra Espresso Shot', price: 0.75 },
    { id: 'oat-milk', name: 'Oat Milk', price: 0.65 },
    { id: 'vanilla-syrup', name: 'Vanilla Syrup', price: 0.50 },
    { id: 'caramel-syrup', name: 'Caramel Syrup', price: 0.50 },
  ];

  const handleRemoveItem = (index: number) => {
    console.log(`Removed item at index ${index}`);
  };

  const handleEditItem = (index: number) => {
    console.log(`Edit item at index ${index}`);
  };

  return (
    <div className="max-w-md">
      <OrderSummary 
        items={mockItems}
        addOns={mockAddOns}
        onRemoveItem={handleRemoveItem}
        onEditItem={handleEditItem}
      />
    </div>
  );
}