// src/components/CustomerInfoForm.tsx
import { useState } from "react";

export default function CustomerInfoForm({ onSubmit }: { onSubmit: (info: any) => void }) {
  const today = new Date();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState(today);
  const [pickupTime, setPickupTime] = useState(today);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    if (hours < 6 || hours > 11) {
      alert("Orders are available only between 6:00 AM and 11:00 AM");
      return;
    }
    const newDate = new Date(pickupDate);
    newDate.setHours(hours, minutes);
    setPickupTime(newDate);
  };

  const isSunday = (date: Date) => date.getDay() === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, pickupDate, pickupTime });
  };

  return (
    <form id="order-form" onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Name"
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
      <input
        type="date"
        value={pickupDate.toISOString().split("T")[0]}
        onChange={(e) => {
          const d = new Date(e.target.value);
          if (isSunday(d)) {
            alert("On Sundays we rest to serve you better. See you Monday!");
            return;
          }
          setPickupDate(d);
        }}
        className="w-full border rounded p-2"
        required
      />
      <input
        type="time"
        value={pickupTime.toTimeString().slice(0, 5)}
        onChange={handleTimeChange}
        className="w-full border rounded p-2"
        required
      />
      <button
        type="submit"
        className="w-full bg-[#1D9099] text-white py-2 px-4 rounded hover:bg-[#00454E]"
      >
        Submit Order
      </button>
    </form>
  );
}
