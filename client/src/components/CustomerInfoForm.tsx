import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export default function CustomerInfoForm() {
  const { submitOrder } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [coupon, setCoupon] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOrder({
      name,
      phone,
      deliveryMethod,
      address,
      date,
      time,
      coupon,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded p-4 flex flex-col space-y-2"
    >
      <h3 className="font-semibold text-lg">Your Info</h3>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2 text-sm"
        required
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border rounded p-2 text-sm"
        required
      />

      <div className="text-sm font-medium mt-2">Delivery Method</div>
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            checked={deliveryMethod === "pickup"}
            onChange={() => setDeliveryMethod("pickup")}
          />
          <span>Pickup</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            checked={deliveryMethod === "delivery"}
            onChange={() => setDeliveryMethod("delivery")}
          />
          <span>Delivery</span>
        </label>
      </div>

      {deliveryMethod === "delivery" && (
        <input
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border rounded p-2 text-sm"
          required
        />
      )}

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border rounded p-2 text-sm"
        required
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border rounded p-2 text-sm"
        required
      />

      <input
        type="text"
        placeholder="Enter coupon"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        className="border rounded p-2 text-sm"
      />

      <button
        type="submit"
        className="w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-800 transition mt-2"
      >
        Submit Order
      </button>
    </form>
  );
}
