import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

export default function CustomerInfoForm() {
  const { cart, clearCart, coupon, subtotal, discount, total } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || cart.length === 0) {
      setError("Please enter your name and add at least one item.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Paso 1️⃣: Crear orden principal
      const orderPayload = {
        customerName,
        phone,
        email,
        address,
        subtotal,
        discount,
        total,
        couponCode: coupon?.code || "",
      };

      const orderRes = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || "Error creating order");
      }

      const orderData = await orderRes.json();
      const orderId = orderData.id;

      // Paso 2️⃣: Crear ítems del pedido
      const itemsPayload = {
        orderId,
        items: cart.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          option: item.option,
          addons: item.addons || [],
          subtotal: item.price * item.qty,
        })),
      };

      const itemsRes = await fetch("/.netlify/functions/orderitems-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemsPayload),
      });

      if (!itemsRes.ok) {
        const err = await itemsRes.json();
        throw new Error(err.error || "Error saving items");
      }

      // Paso 3️⃣: Redirigir al Thank You
      clearCart();
      navigate(`/thank-you/${orderId}`);
    } catch (err: any) {
      console.error("Order submission failed:", err);
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-4 space-y-4"
    >
      <h2 className="text-lg font-bold mb-2">Your Info</h2>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Name *</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full font-semibold text-white py-2 rounded transition ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit Order"}
      </button>
    </form>
  );
}
