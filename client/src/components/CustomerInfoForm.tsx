import { useState } from "react";

interface CustomerInfoFormProps {
  onSubmit: (info: any) => void;
}

export default function CustomerInfoForm({ onSubmit }: CustomerInfoFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (deliveryType === "delivery" && !address) {
      alert("Address is required for delivery orders.");
      return;
    }

    if (deliveryType === "delivery" && !zip) {
      alert("ZIP code is required for delivery orders.");
      return;
    }

    onSubmit({ name, email, phone, deliveryType, address, zip, date, time });
  };

  const isSunday = new Date(date).getDay() === 0;
  const timeHour = parseInt(time.split(":")[0]);
  const timeValid = timeHour >= 6 && timeHour <= 11;

  return (
    <form id="order-form" onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border rounded p-2"
        required
      />

      {/* Pickup / Delivery */}
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            name="deliveryType"
            value="pickup"
            checked={deliveryType === "pickup"}
            onChange={() => setDeliveryType("pickup")}
          />
          Pickup
        </label>
        <label>
          <input
            type="radio"
            name="deliveryType"
            value="delivery"
            checked={deliveryType === "delivery"}
            onChange={() => setDeliveryType("delivery")}
          />
          Delivery
        </label>
      </div>

      {deliveryType === "delivery" && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="ZIP Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      )}

      {/* Date & Time */}
      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-1/2 border rounded p-2"
          required
        />
        <input
          type="time"
          value={time}
          min="06:00"
          max="11:00"
          onChange={(e) => setTime(e.target.value)}
          className="w-1/2 border rounded p-2"
          required
        />
      </div>

      {isSunday && (
        <p className="text-red-600 text-sm">
          On Sundays we rest. Service hours are from 6:00 am to 11:00 am.
        </p>
      )}

      {!timeValid && (
        <p className="text-red-600 text-sm">
          Please select a time between 6:00 am and 11:00 am.
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white py-2 rounded"
      >
        Submit Order
      </button>
    </form>
  );
}
