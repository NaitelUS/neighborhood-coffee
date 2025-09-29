import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

export default function CustomerInfoForm() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState("Pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [coupon, setCoupon] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Validate coupon
    let discount = 0;
    if (coupon.trim()) {
      const res = await fetch("/.netlify/functions/coupons");
      const coupons = await res.json();
      const match = coupons.find(
        (c: any) => c.code === coupon.trim().toUpperCase()
      );
      if (match) discount = subtotal * (match.discount / 100);
    }

    const total = subtotal - discount;

    try {
      // 1️⃣ Create main order in Airtable
      const orderRes = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          email,
          address: deliveryMethod === "Delivery" ? address : "Pickup",
          notes,
          subtotal,
          discount,
          total,
        }),
      });

      const newOrder = await orderRes.json();

      // 2️⃣ Create order items
      await Promise.all(
        cart.map((item) =>
          fetch("/.netlify/functions/orderitems-new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: newOrder.id,
              productName: item.name,
              option: item.option,
              quantity: item.quantity,
              addOns: item.addOns?.join(", "),
            }),
          })
        )
      );

      clearCart();
      navigate(`/thank-you/${newOrder.id}`);
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("There was an issue submitting your order. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg shadow-sm p-4 space-y-3"
    >
      <h3 className="font-bold text-lg mb-2">Customer Info</h3>

      <label className="text-sm">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border rounded px-2 py-1 w-full"
      />

      <label className="text-sm">Phone</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="border rounded px-2 py-1 w-full"
      />

      <label className="text-sm">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border rounded px-2 py-1 w-full"
      />

      {/* Delivery Method */}
      <div>
        <label className="font-medium text-sm">Delivery Method</label>
        <div className="flex gap-4 mt-1">
          <label>
            <input
              type="radio"
              name="deliveryMethod"
              value="Pickup"
              checked={deliveryMethod === "Pickup"}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            />{" "}
            Pickup
          </label>
          <label>
            <input
              type="radio"
              name="deliveryMethod"
              value="Delivery"
              checked={deliveryMethod === "Delivery"}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            />{" "}
            Delivery
          </label>
        </div>
      </div>

      {deliveryMethod === "Delivery" && (
        <>
          <label className="text-sm">Delivery Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </>
      )}

      <label className="text-sm">Notes</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border rounded px-2 py-1 w-full"
        placeholder="Special instructions (e.g., no sugar, ring the bell)"
      />

      <label className="text-sm">Coupon</label>
      <input
        type="text"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        className="border rounded px-2 py-1 w-full"
        placeholder="Enter coupon"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded font-semibold"
      >
        Submit Order
      </button>
    </form>
  );
}
