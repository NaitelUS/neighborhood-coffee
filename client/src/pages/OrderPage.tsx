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
import logo from "@/assets/tnclogo.png";

let orderCounter = 1;

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
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
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    return subtotal - discount;
  };

  const applyCoupon = () => {
    setDiscount(0);
    toast({
      title: "Coupon not valid",
      description: "Please try another code.",
      variant: "destructive",
    });
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

    const orderNumber = orderCounter++;
    const orderDetails = `
Order No: ${orderNumber}
Customer: ${info.name}
Email: ${info.email}
Phone: ${info.phone}
Address: ${info.isDelivery ? info.address : "Pickup"}
Date: ${info.preferredDate}
Time: ${info.preferredTime}
Notes: ${info.specialNotes || "None"}

Items:
${orderItems
  .map(
    (item) =>
      `${item.quantity}x ${item.temperature} ${item.drinkName} - $${item.totalPrice.toFixed(2)}`
  )
  .join("\n")}

Total: $${calculateTotal().toFixed(2)}
`;

    setIsSubmitting(true);

    try {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/";
      form.setAttribute("data-netlify", "true");

      const fields: Record<string, string> = {
        "form-name": "order",
        name: info.name,
        email: info.email,
        phone: info.phone,
        address: info.isDelivery ? info.address : "Pickup",
        preferredDate: info.preferredDate,
        preferredTime: info.preferredTime,
        specialNotes: info.specialNotes || "",
        orderDetails,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      toast({
        title: "Thank you! Your order has been received. Enjoy! ☕",
        description: `Order No: ${orderNumber} | Total: $${calculateTotal().toFixed(2)}`,
      });

      setOrderItems([]);
      setCustomerInfo({});
      setDiscount(0);
      setCoupon("");
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
          <img src={logo} alt="Logo" className="h-12" />

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() =>
              document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" })
            }
          >
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

          {/* Right Column */}
          <div className="space-y-6" id="order-form">
            <OrderSummary items={orderItems} addOns={addOnOptions} onRemoveItem={removeFromOrder} />

            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 border px-3 py-2 rounded"
              />
              <Button
                type="button"
                onClick={applyCoupon}
                className="bg-[#1D9099] hover:bg-[#00454E] text-white"
              >
                Apply
              </Button>
            </div>

            <CustomerInfoForm onInfoChange={setCustomerInfo} />

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
