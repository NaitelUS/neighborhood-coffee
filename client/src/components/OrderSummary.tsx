import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit3 } from "lucide-react";
import type { OrderItem, AddOn } from "@shared/schema";

interface OrderSummaryProps {
  items: OrderItem[];
  addOns: AddOn[];
  onRemoveItem: (index: number) => void;
  onEditItem?: (index: number) => void;
}

export default function OrderSummary({ items, addOns, onRemoveItem, onEditItem }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.0875; // 8.75% tax rate
  const total = subtotal + tax;

  const getAddOnNames = (addOnIds: string[]) => {
    return addOnIds
      .map(id => addOns.find(addon => addon.id === id)?.name)
      .filter(Boolean);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Your order is empty</p>
          <p className="text-sm mt-1">Add some delicious coffee to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif" data-testid="order-summary-title">
          Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg"
              data-testid={`order-item-${index}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium" data-testid={`item-name-${index}`}>
                      {item.drinkName}
                    </h4>
                    <Badge variant="outline" data-testid={`item-temperature-${index}`}>
                      {item.temperature}
                    </Badge>
                    {item.quantity > 1 && (
                      <Badge variant="secondary" data-testid={`item-quantity-${index}`}>
                        ×{item.quantity}
                      </Badge>
                    )}
                  </div>
                  
                  {item.addOns.length > 0 && (
                    <div className="text-sm text-muted-foreground" data-testid={`item-addons-${index}`}>
                      Add-ons: {getAddOnNames(item.addOns).join(', ')}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-2">
                  <span className="font-medium" data-testid={`item-price-${index}`}>
                    ${item.totalPrice.toFixed(2)}
                  </span>
                  {onEditItem && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditItem(index)}
                      data-testid={`button-edit-${index}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                    data-testid={`button-remove-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span data-testid="subtotal">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (8.75%)</span>
            <span data-testid="tax">${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span data-testid="total">${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}