import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DrinkCard from "@/components/DrinkCard";
import AddOnSelector from "@/components/AddOnSelector";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { drinkOptions, addOnOptions } from "@/data/menuData";
import type { OrderItem } from "@shared/schema";
import { Coffee, ShoppingCart } from "lucide-react";

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number>(1000);
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

  const buildOrderDetails = () => {
    const rows = orderItems
      .map(
        (item) => `
          <tr>
            <td>${item.quantity}</td>
            <td>${item.drinkName}</td>
            <td>${item.temperature}</td>
            <td>$${item.totalPrice.toFixed(2)}</td>
          </tr>`
      )
      .join("");

    return `
      <div style="font-family:sans-serif; padding:10px;">
        <img src="https://raw.githubusercontent.com/tu-repo/assets/tnclogo.png" alt="Logo" style="max-width:150px; margin-bottom:10px;" />
        <h2>Your Neighborhood Coffee Order Confirmation ☕</h2>
        <p><strong>Order Number:</strong> ORD-${orderNumber}</p>

        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%;">
          <thead style="background:#f4f4f4;">
            <tr>
              <th align="left">Qty</th>
              <th align="left">Item</th>
              <th align="left">Temp</th>
              <th align="left">Price</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <p><strong>Total:</strong> $${calculateTotal().toFixed(2)}</p>

        <p>
          <strong>Customer:</strong> ${(customerInfo as any).name || ""}<br/>
          <strong>Email:</strong> ${(customerInfo as any).email || ""}<br/>
          <strong>Phone:</strong> ${(customerInfo as any).phone || ""}<br/>
          <strong>Address:</strong> ${(customerInfo as any).address || "N/A"}<br/>
          <strong>Pickup/Delivery:</strong> ${(customerInfo as any).isDelivery ? "Delivery" : "Pickup"}<br/>
          <strong>Date:</strong> ${(customerInfo as any).preferredDate || ""}<br/>
          <strong>Time:</strong> ${(customerInfo as any).preferredTime || ""}
        </p>
      </div>
    `;
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

    const info = customerInfo as any;
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
    setOrderNumber(prev => prev + 1);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Thank you! Your order has been received 🎉",
        description: `Your order number is ORD-${orderNumber}. We'll send confirmation details to ${info.email}.`,
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
            <img src="/assets/tnclogo.png" alt="TNC Logo" className="h-10" />
          </div>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
            document.getElementById("customer-info")?.scrollIntoView({ behavior: "smooth" });
          }}>
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span>{orderItems.length} items</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-semibold mb-6" data-testid="menu-title">
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

          <div className="space-y-6" id="customer-info">
            <OrderSummary
              items={orderItems}
              addOns={addOnOptions}
              onRemoveItem={removeFromOrder}
            />

            <CustomerInfoForm
              onInfoChange={setCustomerInfo}
              orderDetails={buildOrderDetails()}
              orderNumber={orderNumber}
            />

            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || orderItems.length === 0}
              className="w-full h-12 text-lg bg-[#1D9099] hover:bg-[#00454E] text-white"
              data-testid="button-submit-order"
            >
              {isSubmitting ? 'Submitting Order...' : `Submit Order - $${calculateTotal().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
