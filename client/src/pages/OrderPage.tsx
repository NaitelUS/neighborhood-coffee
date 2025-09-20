import { useState } from "react";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import type { OrderItem } from "@shared/schema";

// ... el resto de tus imports

let orderCounter = 1000; // puedes empezar desde el número que quieras

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderDetails, setOrderDetails] = useState<string>("");
  const [total, setTotal] = useState<number>(0);

  const generateOrderNumber = () => {
    orderCounter += 1;
    return orderCounter.toString();
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const buildOrderDetails = () => {
    return orderItems
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.quantity}x ${item.temperature} ${item.drinkName} (${item.addOns.join(", ") || "no add-ons"}) - $${item.totalPrice.toFixed(2)}`
      )
      .join("\n");
  };

  const handleSubmitOrder = () => {
    const newOrderNumber = generateOrderNumber();
    const details = buildOrderDetails();
    const totalAmount = calculateTotal();

    setOrderNumber(newOrderNumber);
    setOrderDetails(details);
    setTotal(totalAmount);

    console.log("Order saved:", {
      orderNumber: newOrderNumber,
      items: orderItems,
      customer: customerInfo,
      total: totalAmount,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... tus componentes de menú y resumen */}

      <CustomerInfoForm
        onInfoChange={setCustomerInfo}
        orderNumber={orderNumber}
        orderDetails={orderDetails}
        total={total}
      />

      <button
        onClick={handleSubmitOrder}
        className="w-full h-12 mt-4 rounded bg-[#1D9099] hover:bg-[#00454E] text-white"
      >
        Generate Order & Send
      </button>
    </div>
  );
}
