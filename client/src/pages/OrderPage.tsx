import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DrinkCard from "@/components/DrinkCard";
import AddOnSelector from "@/components/AddOnSelector";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { drinkOptions, addOnOptions } from "@/data/menuData";
import type { OrderItem } from "@shared/schema";
import { ShoppingCart } from "lucide-react";

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderNumber, setOrderNumber] = useState(1000);
  const { toast } = useToast();

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
    return subtotal - subtotal * discount;
  };

  const applyCoupon = () => {
    if (coupon.toLowerCase() === "coffee10") {
      setDiscount(0.1);
      toast({ title: "Coupon applied!", description: "10% discount applied." });
    } else {
      setDiscount(0);
      toast({
        title: "Coupon not valid",
        description: "Please try another code.",
        variant: "destructive",
      });
    }
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
    if (
      !info.name ||
      !info.email ||
      !info.phone ||
      !info.preferredDate ||
      !info.preferredTime
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required customer information.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const nextOrderNumber = orderNumber + 1;
      setOrderNumber(nextOrderNumber);

      toast({
        title: "Order submitted successfully!",
        description: `Your order number is ${nextOrderNumber}. Total: $${calculateTotal().toFixed(
          2
        )}. Enjoy!`,
      });

      setOrderItems([]);
      setCoupon("");
      setDiscount(0);
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
            <img
              src="/attached_assets/tnclogo.png"
              alt="The Neighborhood Coffee"
              className="h-10"
            />
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span>{orderItems.length} items</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
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

          {/* Right Column */}
          <div className="space-y-6">
            <OrderSummary
              items={orderItems}
              addOns={addOnOptions}
              onRemoveItem={removeFromOrder}
            />

            {/* Coupon */}
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="border px-2 py-1 rounded w-full"
              />
              <Button onClick={applyCoupon} className="bg-[#1D9099] hover:bg-[#00454E] text-white">
                Apply
              </Button>
            </div>

            <CustomerInfoForm
              onInfoChange={setCustomerInfo}
              orderDetails={{
                items: orderItems,
                total: calculateTotal().toFixed(2),
                orderNumber,
              }}
            />

            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || orderItems.length === 0}
              className="w-full h-12 text-lg bg-[#1D9099] hover:bg-[#00454E] text-white"
            >
              {isSubmitting
                ? "Submitting Order..."
                : `Submit Order - $${calculateTotal().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
