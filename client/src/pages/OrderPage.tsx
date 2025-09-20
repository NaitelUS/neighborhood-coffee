import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DrinkCard from "@/components/DrinkCard";
import AddOnSelector from "@/components/AddOnSelector";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { drinkOptions, addOnOptions } from "@/data/menuData";
import type { OrderItem } from "@shared/schema";
import { Coffee } from "lucide-react";

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addToOrder = (
    drinkId: string,
    temperature: "hot" | "iced",
    quantity: number,
    addOns: string[]
  ) => {
    const drink = drinkOptions.find((d) => d.id === drinkId);
    if (!drink) return;

    // Calculate add-on cost
    const addOnCost = addOns.reduce((total, addOnId) => {
      const addOn = addOnOptions.find((a) => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);

    const totalPrice = (drink.basePrice + addOnCost) * quantity;

    const newItem: OrderItem = {
      drinkId,
      drinkName: drink.name,
      temperature,
      quantity,
      basePrice: drink.basePrice,
      addOns: [...addOns],
      totalPrice,
    };

    setOrderItems((prev) => [...prev, newItem]);

    toast({
      title: "Added to order!",
      description: `${quantity}x ${temperature} ${drink.name} added to your order.`,
    });
  };

  const removeFromOrder = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
    toast({
      title: "Item removed",
      description: "Item has been removed from your order.",
    });
  };

  const calculateTotal = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.0875;
    return subtotal + tax;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <Coffee className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-serif font-semibold text-primary">
              The Neighborhood Coffee
            </h1>
          </div>
          <p className="text-center text-muted-foreground mt-2">
            Freshly roasted, locally loved
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Menu & Add-ons */}
          <div className="lg:col-span-2 space-y-8">
            {/* Coffee Menu */}
            <section>
              <h2
                className="text-2xl font-serif font-semibold mb-6"
                data-testid="menu-title"
              >
                Our Coffee Menu
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {drinkOptions.map((drink) => (
                  <DrinkCard
                    key={drink.id}
                    drink={drink}
                    addOns={addOnOptions}
                    onAddToOrder={addToOrder}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary & Customer Info */}
          <div className="space-y-6">
            <OrderSummary
              items={orderItems}
              addOns={addOnOptions}
              onRemoveItem={removeFromOrder}
            />

            {/* Customer Info Form + Submit Button */}
            <CustomerInfoForm onInfoChange={setCustomerInfo}>
              <Button
                type="submit"
                disabled={isSubmitting || orderItems.length === 0}
                className="w-full h-12 text-lg"
                data-testid="button-submit-order"
              >
                {isSubmitting
                  ? "Submitting Order..."
                  : `Submit Order - $${calculateTotal().toFixed(2)}`}
              </Button>
            </CustomerInfoForm>
          </div>
        </div>
      </div>
    </div>
  );
}
