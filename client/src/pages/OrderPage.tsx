// src/pages/OrderPage.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DrinkCard from "@/components/DrinkCard";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { drinkOptions, addOnOptions } from "@/data/menuData";
import type { OrderItem } from "@shared/schema";
import { ShoppingCart } from "lucide-react";

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  // ✅ Generar número consecutivo guardado en localStorage
  const getNextOrderNumber = () => {
    const last = localStorage.getItem("lastOrderNumber");
    const next = last ? parseInt(last) + 1 : 1;
    localStorage.setItem("lastOrderNumber", next.toString());
    return next;
  };

  const addToOrder = (
    drinkId: string,
    temperature: "hot" | "iced",
    quantity: number,
    addOns: string[]
  ) => {
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
      description: `${quantity}x ${temperature} ${drink.name} added.`,
    });
  };

  const removeFromOrder = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSubmitOrder = () => {
    if (orderItems.length === 0) {
      toast({
        title: "Order is empty",
        description: "Please add at least one item.",
        variant: "destructive",
      });
      return;
    }

    const info = customerInfo as any;
    if (
      !info.name ||
      !info.email ||
      !info.phone ||
      !info.preferredDate ||
      !info.preferredTime
    ) {
      toast({
        title: "Missing info",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // ✅ Crear número de orden
    const orderNumber = getNextOrderNumber();

    // ✅ Guardar en localStorage
    const orderData = {
      orderNumber,
      customer: info,
      items: orderItems,
      total: calculateTotal(),
      status: "Received", // 👈 Status inicial
      createdAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    existingOrders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // ✅ Redirigir al Thank You
    window.location.href = `/thank-you?orderNo=${orderNumber}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <img
            src="/attached_assets/tnclogo.png"
            alt="Logo"
            className="h-12 w-auto"
          />

          <button
            className="relative"
            onClick={() =>
              formRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <ShoppingCart className="h-8 w-8 text-primary" />
            {orderItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {orderItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Menu */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-semibold mb-6">
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

          {/* Right - Order + Form */}
          <div className="space-y-6" ref={formRef}>
            <OrderSummary
              items={orderItems}
              addOns={addOnOptions}
              onRemoveItem={removeFromOrder}
            />

            <CustomerInfoForm onInfoChange={setCustomerInfo} />

            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || orderItems.length === 0}
              className="w-full h-12 text-lg bg-[#1D9099] hover:bg-[#00454E] text-white"
            >
              {isSubmitting
                ? "Placing Order..."
                : `Place Order - $${calculateTotal().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
