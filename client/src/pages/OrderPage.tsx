import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DrinkCard from "@/components/DrinkCard";
import AddOnSelector from "@/components/AddOnSelector";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { drinkOptions, addOnOptions } from "@/data/menuData";
import type { OrderItem } from "@shared/schema";
import { ShoppingCart } from "lucide-react";
import tnclogo from "@/assets/tnclogo.png";

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState(1000); // inicia desde 1000
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  const addToOrder = (drinkId: string, temperature: "hot" | "iced", quantity: number, addOns: string[]) => {
    const drink = drinkOptions.find((d) => d.id === drinkId);
    if (!drink) return;

    // Add-ons
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

  // 🔹 Calcular solo el total (sin tax)
  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  // 🔹 Armar detalles de la orden (para email y hidden input)
  const buildOrderDetails = () => {
    let details = "Order Summary:\n";
    orderItems.forEach((item, i) => {
      details += `${i + 1}. ${item.quantity}x ${item.temperature} ${item.drinkName}`;
      if (item.addOns.length > 0) {
        const addOnNames = item.addOns
          .map((id) => addOnOptions.find((a) => a.id === id)?.name || "")
          .join(", ");
        details += ` (Add-ons: ${addOnNames})`;
      }
      details += ` - $${item.totalPrice.toFixed(2)}\n`;
    });
    details += `\nTotal: $${calculateTotal().toFixed(2)}\n`;
    return details;
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
      // Generar número de orden
      const newOrderNumber = orderNumber + 1;
      setOrderNumber(newOrderNumber);

      toast({
        title: "Order submitted successfully!",
        description: `Your order number is ${newOrderNumber}. We'll send confirmation details to ${info.email}.`,
      });

      // Reset
      setOrderItems([]);
      console.log("Order submitted:", {
        items: orderItems,
        customer: customerInfo,
        total: calculateTotal(),
        orderNumber: newOrderNumber,
      });
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
          {/* Logo */}
          <img src={tnclogo} alt="Logo" className="h-10" />

          {/* Cart */}
          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="relative flex items-center gap-2 text-primary"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="text-sm">Cart ({orderItems.length})</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu */}
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
                    buttonClass="bg-[#1D9099] hover:bg-[#00454E] text-white"
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Order + Form */}
          <div className="space-y-6" ref={formRef}>
            <OrderSummary items={orderItems} addOns={addOnOptions} onRemoveItem={removeFromOrder} />

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
              {isSubmitting ? "Submitting Order..." : `Submit Order - $${calculateTotal().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
