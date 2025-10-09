import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";

export default function OrderPage() {
  const { items, clearCart, getTotal } = useCart();
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    orderType: "Pickup",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const orderData = {
      customer_name: customer.name,
      customer_phone: customer.phone,
      address: customer.address,
      order_type: customer.orderType,
      items,
      total: getTotal(),
    };

    try {
      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        window.location.href = `/thank-you?id=${data.orderId}`;
      } else {
        throw new Error("Failed to submit order");
      }
    } catch (err) {
      console.error("Order error:", err);
      setMessage("⚠️ There was an error submitting your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center text-[#00454E]">
        Your Order
      </h1>

      <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          className="w-full border rounded-lg p-2"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          className="w-full border rounded-lg p-2"
        />
        <select
          value={customer.orderType}
          onChange={(e) => setCustomer({ ...customer, orderType: e.target.value })}
          className="w-full border rounded-lg p-2"
        >
          <option value="Pickup">Pickup</option>
          <option value="Delivery">Delivery</option>
        </select>
        {customer.orderType === "Delivery" && (
          <input
            type="text"
            placeholder="Delivery Address"
            value={customer.address}
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />
        )}
      </div>

      <OrderSummary />

      {message && (
        <div className="text-center text-red-600 text-sm">{message}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-[#00454E] text-white py-2 rounded-lg font-medium hover:bg-[#006d72]"
      >
        {submitting ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
