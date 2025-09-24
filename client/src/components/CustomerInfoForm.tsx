// client/src/components/CustomerInfoForm.tsx
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (deliveryMethod === "Delivery" && !address.trim()) {
      alert("Please provide a delivery address.");
      return;
    }

    // Generar número de orden
    const orderId = Math.floor(Math.random() * 100000).toString();

    // Calcular total
    const total = (cart ?? []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Preparar objeto de orden
    const newOrder = {
      id: orderId,
      customerName: name,
      items: (cart ?? []).map((item) => {
        const option = item.option ? ` (${item.option})` : "";
        return `${item.name}${option} x${item.quantity}`;
      }),
      total,
      status: "Received",
      phone,
      email,
      address: deliveryMethod === "Delivery" ? address : "Pickup",
      notes,
    };

    // Guardar en localStorage
    const saved = localStorage.getItem("orders");
    const orders = saved ? JSON.parse(saved) : [];
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Limpiar carrito
    clearCart();

    // Redirigir a página Thank You
    navigate(`/thank-you/${orderId}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg shadow-sm p-4 space-y-3"
    >
      <h3 className="font-bold text-lg mb-2">Customer Info</h3>

      <div className="flex flex-col">
        <label className="text-sm">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-2 py-1"
        />
      </div>

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
        <div className="flex flex-col">
          <label className="text-sm">Delivery Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded px-2 py-1"
            required={deliveryMethod === "Delivery"}
          />
        </div>
      )}

      <div className="flex flex-col">
        <label className="text-sm">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border rounded px-2 py-1"
          placeholder="Special instructions (e.g., no sugar, ring the bell)"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded font-semibold"
      >
        Submit Order
      </button>
    </form>
  );
}
