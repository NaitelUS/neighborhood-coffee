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

let orderCounter = 1000; // contador inicial de órdenes

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const { toast } = useToast();

  const addToOrder = (drinkId: string, temperature: "hot" | "iced", quantity: number, addOns: string[]) => {
    const drink = drinkOptions.find((d) => d.id === drinkId);
    if (!drink) return;

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
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  // Construir el cuerpo de la orden para el correo
  const buildOrderDetails = () => {
    const itemsList = orderItems
      .map(
        (item, i) =>
          `${i + 1}. ${item.quantity}x ${item.temperature} ${item.drinkName} - $${item.totalPrice.toFixed(2)}`
      )
      .join("\n");

    return `
Order Number: ${orderNumber}
Customer: ${(customerInfo as any).name || ""}
Email: ${(customerInfo as any).email || ""}
Phone: ${(customerInfo as any).phone || ""}
Address: ${(customerInfo as any).address || "N/A"}
Pickup/Delivery: ${(customerInfo as any).isDelivery ? "Delivery" : "Pickup"}
Date: ${(customerInfo as any).preferredDate || ""}
Time: ${(customerInfo as any).preferredTime || ""}

Items:
${itemsList}

Total: $${calculateTotal().toFixed(2)}
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

    try {
      // Generar número de orden consecutivo
      const newOrderNumber = `ORD-${orderCounter++}`;
      setOrderNumber(newOrderNumber);

      toast({
        title: "Order submitted successfully!",
        description: `Your order number is ${newOrderNumber}. Total: $${calculateTotal().toFixed(2)}. Enjoy your coffee! ☕`,
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/tnclogo.png" alt="Logo" className="h-10 w-auto" />
          </div>

          {/* Carrito */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              const element = document.getElementById("customer-info-form");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Coffee className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Cart ({orderItems.length})</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Menu */}
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
                    buttonClassName="bg-[#1D9099] hover:bg-[#00454E] text-white"
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

            <div id="customer-info-form">
              <CustomerInfoForm
                onInfoChange={setCustomerInfo}
                orderNumber={orderNumber}
                orderDetails={buildOrderDetails()}
              />
            </div>

            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || orderItems.length === 0}
              className="w-full h-12 text-lg bg-[#1D9099] hover:bg-[#00454E] text-white"
              data-testid="button-submit-order"
            >
              {isSubmitting ? "Submitting Order..." : `Submit Order - $${calculateTotal().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
