import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";
import QuickContact from "../components/QuickContact";

const OrderPage = () => {
  const { cartItems, subtotal, total, discount, appliedCoupon, clearCart } =
    useContext(CartContext);

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
    <div className="max-w-3xl mx-auto px-4 py-6">
      <OrderSummary />
      <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">
        Customer Information
      </h2>

      {/* Pickup / Delivery */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="method"
            value="Pickup"
            checked={form.method === "Pickup"}
            onChange={() => handleMethodChange("Pickup")}
          />
          Pickup
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="method"
            value="Delivery"
            checked={form.method === "Delivery"}
            onChange={() => handleMethodChange("Delivery")}
          />
          Delivery
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 ${
            form.method === "Delivery" ? "opacity-100" : "opacity-50"
          }`}
          disabled={form.method !== "Delivery"}
        />
        <div className="flex gap-3">
          <input
            type="date"
            name="schedule_date"
            value={form.schedule_date}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-1/2"
          />
          <input
            type="time"
            name="schedule_time"
            value={form.schedule_time}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-1/2"
          />
        </div>
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00454E] text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {loading ? "Submitting..." : "Place Order"}
        </button>
      </form>

      {/* 📞📍 Quick Contact */}
      <QuickContact />
    </div>
  );
};

export default OrderPage;
