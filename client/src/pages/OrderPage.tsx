import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";

const OrderPage: React.FC = () => {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState("Pickup");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          orderType,
          scheduleDate,
          scheduleTime,
          cartItems,
          total,
        }),
      });

      const data = await response.json();

      if (data.success) {
        clearCart();
        navigate(`/thank-you?orderId=${data.orderId}`);
      } else {
        alert("⚠️ There was an error placing your order. Please try again.");
      }
    } catch (error) {
      console.error("Order submit error:", error);
      alert("Error placing order. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Your cart is empty
        </h2>
        <a href="/" className="text-emerald-600 underline">
          ← Go back to menu
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 mt-4 mb-12">
      {/* 🧾 Order Summary Section */}
      <div className="bg-white shadow-md rounded-2xl p-4 md:p-6">
        <OrderSummary />
      </div>

      {/* 👤 Customer Form Section */}
      <div className="bg-white shadow-md rounded-2xl p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4 text-center">
          Customer Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              placeholder="555-123-4567"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Order Type
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="Pickup">Pickup</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Time
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 mt-3 font-semibold text-white rounded-md transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
