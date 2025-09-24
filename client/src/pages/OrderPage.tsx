import React, { useState } from "react";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { useCart } from "@/hooks/useCart";

export default function OrderPage() {
  const { cartItems, applyCoupon } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [address, setAddress] = useState("");

  // Aplicar cupón
  const handleCoupon = () => {
    if (couponInput.trim() !== "") {
      applyCoupon(couponInput);
    }
  };

  // Enviar orden
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Please add items to your order before submitting.");
      return;
    }

    if (deliveryMethod === "delivery" && !address.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    const orderId = Math.floor(Math.random() * 100000);
    window.location.href = `/thank-you/${orderId}`;
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Placeholder de menú */}
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Our Coffee Menu</h1>
        <p className="text-gray-600 mb-6">
          Select your drink or pastry, customize it, and add to order.
        </p>
        {/* Aquí se renderizan los <MenuItem /> según tu menú */}
      </div>

      {/* Sidebar */}
      <div>
        <OrderSummary />

        {/* Coupon */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Coupon</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="Enter coupon"
            />
            <button
              type="button"
              onClick={handleCoupon}
              className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Delivery / Pickup */}
        <div className="mt-4">
          <span className="block text-sm font-medium mb-1">
            Delivery Method
          </span>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={deliveryMethod === "pickup"}
                onChange={() => setDeliveryMethod("pickup")}
              />
              Pickup
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={deliveryMethod === "delivery"}
                onChange={() => setDeliveryMethod("delivery")}
              />
              Delivery
            </label>
          </div>
          {deliveryMethod === "delivery" && (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-2"
              placeholder="Delivery address"
            />
          )}
        </div>

        {/* Customer Info */}
        <CustomerInfoForm />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}
