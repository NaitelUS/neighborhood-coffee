import { useState } from "react";
import OrderSummary from "@/components/OrderSummary";

type OrderItem = {
  id: string;
  name: string;
  temperature: string;
  quantity: number;
  basePrice: number;
  addOns: string[];
};

const addOnOptions = [
  { id: "extraShot", name: "Extra Espresso Shot (+$0.75)", price: 0.75 },
  { id: "oatMilk", name: "Oat Milk (+$0.50)", price: 0.5 },
  { id: "caramel", name: "Caramel Syrup (+$0.50)", price: 0.5 },
  { id: "vanilla", name: "Vanilla Syrup (+$0.50)", price: 0.5 },
  { id: "whipped", name: "Whipped Cream (+$0.50)", price: 0.5 },
];

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = orderItems.reduce((acc, item) => {
    const addOnsTotal = item.addOns.reduce((sum, addOnId) => {
      const addOn = addOnOptions.find((a) => a.id === addOnId);
      return sum + (addOn ? addOn.price : 0);
    }, 0);
    return acc + (item.basePrice + addOnsTotal) * item.quantity;
  }, 0);

  const discount = couponApplied ? subtotal * 0.15 : 0;
  const total = subtotal - discount;

  const applyCoupon = (code: string) => {
    if (code === "COFFEE15") {
      setCoupon(code);
      setCouponApplied(true);
    }
  };

  const removeItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Our Coffee Menu</h1>
        {/* Aquí iría el listado de productos */}
      </div>
      <div>
        <OrderSummary
          items={orderItems}
          subtotal={subtotal}
          discount={discount}
          total={total}
          applyCoupon={applyCoupon}
          couponApplied={couponApplied}
          removeItem={removeItem}
          addOnOptions={addOnOptions}
        />
        {/* Customer Info */}
        <div className="mt-4 border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Customer Information</h2>
          <input className="w-full border p-2 mb-2 rounded" placeholder="Full Name" />
          <input className="w-full border p-2 mb-2 rounded" placeholder="Email" />
          <input className="w-full border p-2 mb-2 rounded" placeholder="Phone" />
          <div className="mt-2">
            <p className="font-bold mb-1">Delivery Method</p>
            <div className="flex gap-4">
              <label>
                <input type="radio" name="delivery" defaultChecked /> Pickup
              </label>
              <label>
                <input type="radio" name="delivery" /> Delivery
              </label>
            </div>
          </div>
          <button className="mt-4 w-full bg-[#1D9099] hover:bg-[#00454E] text-white p-2 rounded">
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}
