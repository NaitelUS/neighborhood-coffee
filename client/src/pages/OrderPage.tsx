import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";

export default function OrderPage() {
  const cart = useContext(CartContext);
  const navigate = useNavigate();
  if (!cart) return null;

  const { cartItems, subtotal, discount, total, discountRate, appliedCoupon, clearCart } = cart;

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    orderType: "Pickup",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    setMessage("");

    const payload = {
      customer_name: customer.name,
      customer_phone: customer.phone,
      address: customer.orderType === "Delivery" ? customer.address : "",
      order_type: customer.orderType,
      notes: customer.notes,
      items: cartItems,
      subtotal,
      discount,
      total,
      coupon_code: appliedCoupon || "",
      discount_rate: discountRate, // para referencia si lo quieres usar en back
    };

    try {
      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        window.location.href = `/thank-you?id=${data.orderId}`;
      } else {
        throw new Error("Order not saved");
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
      {/* Botón para volver al menú SIN perder el carrito */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="text-[#00454E] underline font-medium"
        >
          Want more items?
        </button>
      </div>

      {/* Datos del cliente */}
      <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <h2 className="text-lg font-semibold text-[#00454E]">Customer</h2>
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
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm font-medium">Order Type</label>
          <select
            value={customer.orderType}
            onChange={(e) => setCustomer({ ...customer, orderType: e.target.value })}
            className="w-full border rounded-lg p-2"
          >
            <option value="Pickup">Pickup</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>
        {customer.orderType === "Delivery" && (
          <input
            type="text"
            placeholder="Delivery Address"
            value={customer.address}
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            className="w-full border rounded-lg p-2"
          />
        )}
        <textarea
          placeholder="Notes / special instructions"
          value={customer.notes}
          onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
          className="w-full border rounded-lg p-2"
          rows={3}
        />
      </div>

      <OrderSummary />

      {message && <div className="text-center text-red-600 text-sm">{message}</div>}

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
