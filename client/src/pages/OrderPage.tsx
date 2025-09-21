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

let orderCounter = 1000; // contador simple para generar ordenes

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const { toast } = useToast();

  const addToOrder = (drinkId: string, temperature: 'hot' | 'iced', quantity: number, addOns: string[]) => {
    const drink = drinkOptions.find(d => d.id === drinkId);
    if (!drink) return;

    const addOnCost = addOns.reduce((total, addOnId) => {
      const addOn = addOnOptions.find(a => a.id === addOnId);
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

    setOrderItems(prev => [...prev, newItem]);

    toast({
      title: "Added to order!",
      description: `${quantity}x ${temperature} ${drink.name} added to your order.`,
    });
  };

  const removeFromOrder = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Item removed",
      description: "Item has been removed from your order.",
    });
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const generateOrderDetails = (info: any, newOrderNumber: number) => {
    let itemsText = orderItems
      .map(
        (item) =>
          `- ${item.quantity}x ${item.temperature} ${item.drinkName} — $${item.totalPrice.toFixed(2)}`
      )
      .join("\n");

    return `
Order No: ${newOrderNumber}
Customer: ${info.name}
Email: ${info.email}
Phone: ${info.phone}
Address: ${info.address || "Pickup at store"}
Pickup Date: ${info.preferredDate}
Pickup Time: ${info.preferredTime}
Delivery: ${info.isDelivery ? "Yes" : "No"}

Items:
${itemsText}

Total: $${calculateTotal().toFixed(2)}
Payment: CashApp / Zelle / Cash
    `.trim();
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast({
        title: "Order is empty",
        description: "Please add at least one item to your order.",
        variant: "destructive",
      });
      return;
    }

    const info = customerInfo;
    if (!info.name || !info.email || !info.phone || !info.preferredDate || !info.preferredTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required customer information.",
        variant: "destructive",
      });
      return;
    }

    if (info.isDelivery && !info.address) {
      toast({
        title: "Missing address",
        description: "Please provide a delivery address since delivery is selected.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrderNumber = orderCounter++;
      setOrderNumber(newOrderNumber);

      const details = generateOrderDetails(info, newOrderNumber);

      console.log("Order submitted:", { items: orderItems, customer: customerInfo, orderNumber: newOrderNumber, details });

      toast({
        title: "Order submitted successfully!",
        description: `Your order number is ${newOrderNumber}. We'll send confirmation details to ${info.email}.`,
      });

      setOrderItems([]);
    } catch (error) {
      toast({
        title: "Order failed",
        description: "There was an error submitting your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/attached_assets/tnclogo.png" alt="Logo" className="h-10" />
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-primary" />
            <span>{orderItems.length} items</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-semibold mb-6">Our Coffee Menu</h2>
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

          {/* Summary + Info */}
          <div className="space-y-6">
            <OrderSummary
              items={orderItems}
              addOns={addOnOptions}
              onRemoveItem={removeFromOrder}
            />

            <CustomerInfoForm
              onInfoChange={setCustomerInfo}
              orderDetails={orderNumber ? generateOrderDetails(customerInfo, orderNumber) : ""}
            />

            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || orderItems.length === 0}
              className="w-full h-12 text-lg bg-[#1D9099] hover:bg-[#00454E] text-white"
            >
              {isSubmitting ? "Submitting Order..." : `Submit Order - $${calculateTotal().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
