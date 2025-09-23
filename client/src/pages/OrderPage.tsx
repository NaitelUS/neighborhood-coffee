import { useState } from "react";
import DrinkCard from "@/components/DrinkCard";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import {
  drinkOptions,
  addOnOptions,
  COUPON_CODE,
  COUPON_DISCOUNT,
} from "@/data/menuData";

interface OrderItem {
  id: string;
  name: string;
  temperature?: "hot" | "iced";
  option?: string;
  quantity: number;
  basePrice: number;
  addOns: string[];
}

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleAddToOrder = (
    drinkId: string,
    temperature: "hot" | "iced",
    quantity: number,
    addOns: string[]
  ) => {
    const drink = drinkOptions.find((d) => d.id === drinkId);
    if (!drink) return;

    setOrderItems((prev) => [
      ...prev,
      {
        id: drink.id,
        name: drink.name,
        temperature,
        quantity,
        basePrice: drink.basePrice,
        addOns,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = orderItems.reduce((acc, item) => {
    const addOnsPrice = item.addOns.reduce((sum, addOnId) => {
      const addOn = addOnOptions.find((a) => a.id === addOnId);
      return sum + (addOn ? addOn.price : 0);
    }, 0);
    return acc + (item.basePrice + addOnsPrice) * item.quantity;
  }, 0);

  const discount = couponApplied ? subtotal * COUPON_DISCOUNT : 0;
  const total = subtotal - discount;

  const applyCoupon = (code: string) => {
    if (code === COUPON_CODE) {
      setCouponApplied(true);
      alert("Coupon applied successfully!");
    } else {
      alert("Invalid coupon code.");
    }
  };

  const handleSubmitOrder = (info: any) => {
    // Guardar orden en localStorage simulando DB
    const orderNo = Date.now().toString().slice(-5);
    localStorage.setItem(
      `order-${orderNo}`,
      JSON.stringify({ items: orderItems, info, subtotal, discount, total })
    );

    // Redirigir a página Thank You
    window.location.href = `/thank-you?orderNo=${orderNo}`;
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Menu */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold mb-2">Our Coffee Menu</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {drinkOptions.map((drink) => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              addOns={addOnOptions}
              onAddToOrder={handleAddToOrder}
            />
          ))}
        </div>
      </div>

      {/* Order Summary + Customer Info */}
      <div>
        <OrderSummary
          items={orderItems}
          subtotal={subtotal}
          discount={discount}
          total={total}
          applyCoupon={applyCoupon}
          couponApplied={couponApplied}
          removeItem={removeItem}
        />
        <div className="mt-6">
          <CustomerInfoForm onSubmit={handleSubmitOrder} />
          <div className="mt-4 text-sm text-center">
            <p className="font-bold">The Neighborhood Coffee</p>
            <p>12821 Little Misty Ln</p>
            <p>El Paso, Texas 79938</p>
            <p>+1 (915) 401-5547</p>
            <p className="mt-2 italic text-[#E5A645]">
              <strong>We’re open weekdays, except Sundays</strong> <br />
              6:00 AM – 11:00 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
