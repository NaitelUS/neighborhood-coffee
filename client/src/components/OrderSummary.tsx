import React from "react";
import type { OrderItem } from "@shared/schema";

interface OrderSummaryProps {
  items: OrderItem[];
  addOns: { id: string; name: string; price: number }[];
  onRemoveItem: (index: number) => void;
  discount: number; // porcentaje aplicado (ej. 0.15 para 15%)
}

export default function OrderSummary({
  items,
  addOns,
  onRemoveItem,
  discount,
}: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-lg font-serif mb-3">Your Order</h3>

      {items.length === 0 ? (
        <p className="text-muted-foreground">No items yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-start border-b pb-2"
            >
              <div>
                <p className="font-medium">
                  {item.quantity}x {item.temperature} {item.drinkName}
                </p>
                {item.addOns.length > 0 && (
                  <ul className="text-sm text-muted-foreground list-disc pl-4">
                    {item.addOns.map((id) => {
                      const addOn = addOns.find((a) => a.id === id);
                      return <li key={id}>{addOn?.name}</li>;
                    })}
                  </ul>
                )}
              </div>
              <div className="text-right">
                <p>${item.totalPrice.toFixed(2)}</p>
                <button
                  className="text-xs text-red-500 hover:underline"
                  onClick={() => onRemoveItem(index)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Subtotal */}
      {items.length > 0 && (
        <div className="mt-4 space-y-1 text-right">
          <p className="font-medium">Subtotal: ${subtotal.toFixed(2)}</p>

          {discount > 0 && (
            <p className="text-green-600 font-medium">
              Promotional Discount: -${discountAmount.toFixed(2)}
            </p>
          )}

          <p className="text-xl font-bold mt-2">TOTAL: ${total.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
