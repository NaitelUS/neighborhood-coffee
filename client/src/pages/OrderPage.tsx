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

  // Inicializa fecha y hora por defecto
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
      address: form.address,
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
      {/* 🧾 Review your order */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Review Your Order
        </h2>
        <OrderSummary />
      </div>

      {/* 👤 Customer Information */}
      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        Customer Information
      </h2>

      {/* 🚚 Pickup / Delivery + Contact */}
      <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleMethodChange("Pickup")}
            className={`px-4 py-2 rounded-lg border font-medium transition-all ${
              form.method === "Pickup"
                ? "bg-[#00454E] text-white border-[#00454E]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Pickup
          </button>
          <button
            type="button"
            onClick={() => handleMethodChange("Delivery")}
            className={`px-4 py-2 rounded-lg border font-medium transition-all ${
              form.method === "Delivery"
                ? "bg-[#00454E] text-white border-[#00454E]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Delivery
          </button>
        </div>

        {/* 📞📍 Contact icons */}
        <div className="flex gap-6 sm:mt-2">
          <a
            href="tel:+19154015547"
            className="text-[#00454E] hover:opacity-80 transition"
            title="Call us"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75C2.25 4.679 3.929 3 6 3h1.125c.621 0 1.136.45 1.221 1.066l.416 2.914a1.125 1.125 0 01-.288.933l-1.5 1.5a16.002 16.002 0 006.939 6.939l1.5-1.5a1.125 1.125 0 01.933-.288l2.914.416A1.125 1.125 0 0121 18.875V20c0 2.071-1.679 3.75-3.75 3.75H18c-8.837 0-16-7.163-16-16v-.25z"
              />
            </svg>
          </a>

          <a
            href="https://maps.google.com/?q=12821+Little+Misty+Ln,+El+Paso,+TX+79938"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00454E] hover:opacity-80 transition"
            title="Open in Maps"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 10.5c0 7.125-9 12.75-9 12.75S3 17.625 3 10.5a9 9 0 1118 0z"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* 📝 Formulario */}
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

        {/* 📍 Address siempre visible, editable solo si es Delivery */}
        <input
          type="text"
          name="address"
          placeholder="Delivery Address"
          value={form.address}
          onChange={handleChange}
          disabled={form.method !== "Delivery"}
          className={`w-full p-2 border rounded ${
            form.method !== "Delivery"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white"
          }`}
        />

        <div className="flex gap-4">
          <input
            type="date"
            name="schedule_date"
            value={form.schedule_date}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
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

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#00454E] text-white py-2 font-semibold rounded hover:opacity-90"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
