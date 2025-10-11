import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const OrderPage: React.FC = () => {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          deliveryType,
          scheduleDate,
          scheduleTime,
          cartItems,
          total,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 🧹 limpia el carrito al registrar orden
        clearCart();
        navigate(`/thank-you?orderId=${data.orderId}`);
      } else {
        alert("⚠️ Error placing order: " + data.error);
      }
    } catch (err) {
      console.error("Order submit error:", err);
      alert("An error occurred while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cartItems.length)
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Your cart is empty
        </h2>
        <a href="/" className="text-emerald-600 underline">
          ← Go back to menu
        </a>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-semibold text-center text-emerald-700 mb-4">
        Complete Your Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone</label>
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            placeholder="555-123-4567"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Delivery Type
          </label>
          <select
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
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
              className="w-full border rounded-md px-3 py-2"
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
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 mt-2 font-semibold text-white rounded-md transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {isSubmitting ? "Placing Order..." : `Place Order ($${total.toFixed(2)})`}
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
