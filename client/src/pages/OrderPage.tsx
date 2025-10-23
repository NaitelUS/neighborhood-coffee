import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";

const OrderPage = () => {
  const {
    cartItems,
    subtotal,
    total,
    discount,
    appliedCoupon,
    clearCart,
  } = useContext(CartContext);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    method: "Pickup",
    schedule_date: "",
    schedule_time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const today = localDate.toISOString().slice(0, 10);
    const plus15 = new Date(now.getTime() + 15 * 60000);
    const formattedTime = plus15.toTimeString().slice(0, 5);
    setForm((prev) => ({
      ...prev,
      schedule_date: today,
      schedule_time: formattedTime,
    }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (method: string) => {
    setForm((prev) => ({ ...prev, method }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.schedule_date || !form.schedule_time) {
      setError("Please fill in all required fields.");
      return;
    }

    setError(null);
    setLoading(true);

    const payload = {
      name: form.name,
      phone: form.phone,
      address: form.method === "Delivery" ? form.address : "",
      order_type: form.method,
      schedule_date: form.schedule_date,
      schedule_time: form.schedule_time,
      subtotal,
      discount,
      total,
      coupon: appliedCoupon || "",
      notes: form.notes,
      items: cartItems.map((item) => ({
        name: item.name,
        option: item.option,
        price: item.price,
        addons: item.addons,
        qty: item.qty || 1,
      })),
    };

    try {
      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.orderId) throw new Error("Order creation failed");

      clearCart();
      navigate(`/thank-you?id=${result.orderId}`);
    } catch (err: any) {
      console.error("❌ Order submission error:", err);
      setError("There was an error submitting your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      {/* 🧾 Review first */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Review Your Order</h2>
        <OrderSummary />

        {/* 🛍️ Want more items button */}
        <button
          type="button"
          onClick={() => navigate("/menu")}
          className="w-full border border-[#00454E] text-[#00454E] py-2 mt-4 rounded font-medium hover:bg-[#00454E] hover:text-white transition"
        >
          Want more items?
        </button>
      </div>

      {/* 👤 Customer Info */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Customer Information</h1>

        {/* 🚚 Pickup / Delivery toggle */}
        <div className="flex gap-3 mb-4">
          {["Pickup", "Delivery"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleMethodChange(option)}
              className={`px-4 py-2 rounded-md border font-medium transition-all ${
                form.method === option
                  ? "bg-[#00454E] text-white border-[#00454E]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {form.method === "Delivery" && (
            <input
              type="text"
              name="address"
              placeholder="Delivery Address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          )}

          <div className="flex gap-4">
            <input
              type="date"
              name="schedule_date"
              value={form.schedule_date}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded"
              min={new Date().toISOString().slice(0, 10)}
              required
            />
            <input
              type="time"
              name="schedule_time"
              value={form.schedule_time}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded"
              required
            />
          </div>

          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-[#00454E] text-white py-2 font-semibold rounded hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Place Order"}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
