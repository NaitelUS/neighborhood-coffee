import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function OrderPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    total,
    discountRate,
    appliedCoupon,
    clearCart,
  } = useContext(CartContext);

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    order_type: "Pickup",
    address: "",
    schedule_date: "",
    schedule_time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError("⚠️ Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subtotal,
          total,
          discountRate,
          appliedCoupon,
          items: cartItems, // ✅ todos los productos con qty, opciones, add-ons
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("❌ Order creation failed:", data);
        setError("⚠️ There was an error submitting your order. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Limpiar carrito y redirigir al thank-you con ID
      clearCart();
      navigate(`/thank-you?id=${data.orderId}`);
    } catch (err) {
      console.error("❌ Error submitting order:", err);
      setError("⚠️ There was an error submitting your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 🧍 Datos del cliente */}
      <input
        type="text"
        name="customer_name"
        placeholder="Your name"
        value={form.customer_name}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
      <input
        type="tel"
        name="customer_phone"
        placeholder="Phone number"
        value={form.customer_phone}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />

      {/* ☕ Tipo de orden */}
      <select
        name="order_type"
        value={form.order_type}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="Pickup">Pickup</option>
        <option value="Delivery">Delivery</option>
      </select>

      {form.order_type === "Delivery" && (
        <input
          type="text"
          name="address"
          placeholder="Delivery address"
          value={form.address}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      )}

      {/* 📅 Fecha / Hora / Notas */}
      <input
        type="date"
        name="schedule_date"
        value={form.schedule_date}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />
      <input
        type="time"
        name="schedule_time"
        value={form.schedule_time}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />
      <textarea
        name="notes"
        placeholder="Special instructions (optional)"
        value={form.notes}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      {/* ⚠️ Mensaje de error */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* 🔘 Botón */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#00454E] text-white py-2 rounded hover:bg-[#1D9099] transition"
      >
        {loading ? "Submitting..." : "Place Order"}
      </button>
    </form>
  );
}
