// src/pages/OrderPage.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DrinkCard from "@/components/DrinkCard";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { drinkOptions } from "@/data/menuData";
import { COUPON_DISCOUNT } from "@/data/menuData";
import type { OrderItem } from "@shared/schema";
import { ShoppingCart } from "lucide-react";

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  const addToOrder = (
    drinkId: string,
    temperature: "hot" | "iced",
    quantity: number,
    addOns: string[]
  ) => {
    const drink = drinkOptions.find((d) => d.id === drinkId);
    if (!drink) return;

    // Precio de add-ons
    const ADDON_PRICES: Record<string, number> = {
      extraShot: 0.75,
      oatMilk: 0.5,
      hazelnut: 0.5,
      caramel: 0.5,
      vanilla: 0.5,
      whipped: 0.5,
    };
    const addOnCost = addOns.reduce((sum, id) => sum + (ADDON_PRICES[id] || 0), 0);
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

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const discount = couponApplied ? subtotal * COUPON_DISCOUNT : 0;
  const total = subtotal - discount;

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast({ title: "Order is empty", description: "Please add at least one item.", variant: "destructive" });
      return;
    }

    const info = customerInfo as any;
    if (!info.name || !info.email || !info.phone || !info.preferredDate || !info.preferredTime) {
      toast({ title: "Missing info", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    if (info.isDelivery && !info.address) {
      toast({ title: "Address required", description: "Please enter delivery address.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderNumber = Date.now(); // id único
      const orderData = {
        orderNo: orderNumber,
        customer: info,
        items: orderItems,
        subtotal,
        discount,
        total,
        status: "Received",
        createdAt: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("orders") || "[]");
      existing.push(orderData);
      localStorage.setItem("orders", JSON.stringify(existing));

      window.location.href = `/thank-you?orderNo=${orderNumber}`;
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
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
          {/* Menu */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-semibold mb-2">
                Our Coffee Menu
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                We serve Monday–Saturday from 6:00am to 11:00am. Sundays we rest ☕
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {drinkOptions.map((drink) => (
                  <DrinkCard
                    key={drink.id}
                    drink={drink}
                    onAddToOrder={addToOrder}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Summary + Form */}
          <div className="space-y-6" ref={formRef}>
            <OrderSummary items={orderItems} couponApplied={couponApplied} />
            <CustomerInfoForm
              onInfoChange={setCustomerInfo}
              onCouponApplied={setCouponApplied}
            />
            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || orderItems.length === 0}
              className="w-full h-12 text-lg bg-[#1D9099] hover:bg-[#00454E] text-white"
            >
              {isSubmitting ? "Placing Order..." : `Place Order - $${Math.max(total,0).toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
