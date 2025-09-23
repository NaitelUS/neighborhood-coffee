import { useEffect, useState } from "react";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { Button } from "@/components/ui/button";

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<any[]>([]);

  // 🔹 Load current-order from localStorage on mount
  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("current-order") || "null");
    if (savedOrder?.items) {
      setOrderItems(savedOrder.items);
    }
  }, []);

  // 🔹 Sync state → localStorage
  useEffect(() => {
    localStorage.setItem("current-order", JSON.stringify({ items: orderItems }));
  }, [orderItems]);

  // 🔹 Remove one item
  const removeItem = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  // 🔹 Submit order
  const handleSubmitOrder = (info: any) => {
    const orderNo = Date.now().toString().slice(-5);
    const currentOrder = JSON.parse(localStorage.getItem("current-order") || "null");

    if (currentOrder) {
      localStorage.setItem(
        `order-${orderNo}`,
        JSON.stringify({ ...currentOrder, info })
      );
    }

    // Clear current-order
    localStorage.removeItem("current-order");
    setOrderItems([]);

    // Redirect to Thank You
    window.location.href = `/thank-you?orderNo=${orderNo}`;
  };

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Customer Info */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Information</h2>
        <CustomerInfoForm onSubmit={handleSubmitOrder} />
      </div>

      {/* Order Summary */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Order</h2>
        <OrderSummary
          items={orderItems}
          subtotal={subtotal}
          onRemoveItem={removeItem}
        />
        <Button
          className="w-full mt-4 bg-[#1D9099] hover:bg-[#00454E] text-white"
          onClick={() => handleSubmitOrder({})}
          disabled={orderItems.length === 0}
        >
          Submit Order
        </Button>
      </div>
    </div>
  );
}
