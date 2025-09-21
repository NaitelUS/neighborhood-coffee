import React from "react";
import { X } from "lucide-react";

interface OrderItem {
  drinkId: string;
  drinkName: string;
  temperature: "hot" | "iced";
  quantity: number;
  basePrice: number;
  addOns: string[];
  totalPrice: number;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  addOns: AddOn[];
  onRemoveItem: (index: number) => void;
}

export default function OrderSummary({
  items,
  addOns,
  onRemoveItem,
}: OrderSummaryProps) {
  const getAddOnName = (id: string) => {
    const addOn = addOns.find((a) => a.id === id);
    return addOn ? `${addOn.name} (+$${addOn.price.toFixed(2)})` : id;
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-serif font-semibold mb-4">Your Order</h2>

      {items.length === 0 ? (
        <p className="text-muted-foreground">No items added yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={index} className="border-b pb-3 last:border-none">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {item.quantity}x {item.temperature} {item.drinkName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${item.totalPrice.toFixed(2)}
                  </p>

                  {/* Mostrar Add-ons si hay */}
                  {item.addOns.length > 0 && (
                    <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                      {item.addOns.map((addOnId) => (
                        <li key={addOnId}>{getAddOnName(addOnId)}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  onClick={() => onRemoveItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Total */}
      <div className="mt-4 flex justify-between font-semibold">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
