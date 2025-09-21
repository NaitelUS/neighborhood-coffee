import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import DrinkCard from "@/components/DrinkCard";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { drinkOptions, addOnOptions } from "@/data/menuData";
import type { OrderItem } from "@shared/schema";
import { ShoppingCart } from "lucide-react";

let globalOrderCounter = 1;

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // 0.15 = 15%
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

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "FALLBREW15") {
      setDiscount(0.15);
      toast({
        title: "Coupon applied!",
        description: "Enjoy 15% off your order 🎉",
      });
    } else {
      setDiscount(0);
      toast({
        title: "Coupon not valid",
        description: "Please try another code.",
        variant: "destructive",
      });
    }
  };

  const calculateSubtotal = () =>
    orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return +(subtotal - subtotal * discount).toFixed(2);
  };

  const handleSubmitOrder = async () => {
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

    // Generate order number (simple in-memory, reinicia con cada deploy)
    const orderNumber = globalOrderCounter++;

    // Build plain-text summary
    const itemsBlock = orderItems
      .map(
        (item) =>
          `${item.quantity}x ${item.temperature} ${item.drinkName} - $${item.totalPrice.toFixed(
            2
          )}`
      )
      .join("\n");

    const orderDetails = `
Order No: ${orderNumber}
Name: ${info.name}
Email: ${info.email}
Phone: ${info.phone}
Method: ${info.deliveryMethod === "delivery" ? "Delivery" : "Pickup"}
Address: ${info.deliveryMethod === "delivery" ? info.address || "N/A" : "Pickup"}
Preferred Date: ${info.preferredDate}
Preferred Time: ${info.preferredTime}
Notes: ${info.specialNotes || "N/A"}

Items:
${itemsBlock}

Subtotal: $${calculateSubtotal().toFixed(2)}
Discount: ${discount > 0 ? `${(discount * 100).toFixed(0)}% (code: ${couponCode.toUpperCase()})` : "No discount"}
TOTAL: $${calculateTotal().toFixed(2)}
`;

    // Send to Netlify Forms to guardar (sin emails)
    const form = document.createElement("form");
    form.method = "POST";
    form.setAttribute("data-netlify", "true");
    form.style.display = "none";

    const fields: Record<string, string> = {
      "form-name": "order",
      orderNumber: String(orderNumber),
      name: info.name,
      email: info.email,
      phone: info.phone,
      deliveryMethod: info.deliveryMethod,
      address:
        info.deliveryMethod === "delivery" ? info.address || "" : "Pickup",
      preferredDate: info.preferredDate,
      preferredTime: info.preferredTime,
      couponCode: couponCode.trim().toUpperCase(),
      discountPercent: String(discount * 100),
      subtotal: calculateSubtotal().toFixed(2),
      total: calculateTotal().toFixed(2),
      orderDetails: orderDetails.trim(),
      itemsJSON: JSON.stringify(orderItems),
    };

    for (const [name, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

    // Redirige al Thank You con número de orden
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

            {/* Coupon */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleApplyCoupon}
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
