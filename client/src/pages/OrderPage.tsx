import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";

const OrderPage = () => {
  const {
    cartItems,
    subtotal,
    total,
    discount,
    clearCart,
    appliedCoupon,
  } = useContext(CartContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    method: "Pickup",
    notes: "",
    schedule_date: "",
    schedule_time: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (method: string) => {
    setFormData((prev) => ({ ...prev, method }));
  };

  const handleOrderSubmit = async (
    info: any,
    schedule_date: string,
    schedule_time: string
  ) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer_name: info.name,
        customer_phone: info.phone,
        address: info.method === "Delivery" ? info.address : "",
        order_type: info.method,
        schedule_date,
        schedule_time,
        subtotal,
        discount,
        total,
        coupon_code: appliedCoupon || "",
        notes: info.notes || "",
        items: cartItems.map((item) => ({
          name: item.name,
          option: item.option || "",
          price: item.price,
          addons: item.addons || [],
          qty: item.qty || 1, // ✅ Aquí se incluye qty
        })),
      };

      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      if (!res.ok || !result.orderId) throw new Error("Order creation failed");

      navigate(`/thank-you?id=${result.orderId}`);
      clearCart();
    } catch (err) {
      console.error("❌ Error sending order:", err);
      alert("There was an error submitting your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-teal-900">Pickup Details</h1>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleOrderSubmit(formData, formData.schedule_date, formData.schedule_time);
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="schedule_date"
          className="w-full p-2 border rounded"
          value={formData.schedule_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="schedule_time"
          className="w-full p-2 border rounded"
          value={formData.schedule_time}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          className="w-full p-2 border rounded"
          value={formData.notes}
          onChange={handleInputChange}
        />
        <div className="flex items-center gap-4">
          <label>
            <input
              type="radio"
              name="method"
              checked={formData.method === "Pickup"}
              onChange={() => handleMethodChange("Pickup")}
            />
            <span className="ml-2">Pickup</span>
          </label>
          <label>
            <input
              type="radio"
              name="method"
              checked={formData.method === "Delivery"}
              onChange={() => handleMethodChange("Delivery")}
            />
            <span className="ml-2">Delivery</span>
          </label>
        </div>
        {formData.method === "Delivery" && (
          <input
            type="text"
            name="address"
            placeholder="Delivery Address"
            className="w-full p-2 border rounded"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        )}
        <button
          type="submit"
          className="w-full bg-[#00454E] text-white font-bold py-2 rounded hover:bg-teal-700 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Place Order"}
        </button>
      </form>

      <h2 className="text-2xl font-bold my-6 text-teal-900">Review your Order</h2>
      <OrderSummary />
    </div>
  );
};

export default OrderPage;
