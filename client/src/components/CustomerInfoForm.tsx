import { useState } from "react";
import { format } from "date-fns";

export default function CustomerInfoForm({ onSubmit }: { onSubmit: (info: any) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [error, setError] = useState("");

  const validateDateTime = () => {
    const chosen = new Date(`${date}T${time}`);
    const now = new Date();

    // No domingos
    if (new Date(date).getDay() === 0) {
      setError("We’re closed on Sundays, come visit us during the week!");
      return false;
    }

    // No pasado
    if (chosen < now) {
      setError("We can’t deliver to the past… yet ⏳☕");
      return false;
    }

    const hour = chosen.getHours();
    const minute = chosen.getMinutes();

    if (hour < 6) {
      setError("It’s too early, let’s have coffee after 6:00 am ☀️");
      return false;
    }
    if (hour > 11 || (hour === 11 && minute > 0)) {
      setError("Our morning shift ends at 11:00 am, see you tomorrow!");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDateTime()) return;
    onSubmit({ name, email, phone, address, method, date, time });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border rounded p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border rounded p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        className="w-full border rounded p-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <div>
        <p className="font-semibold mb-1">Delivery Method</p>
        <label className="mr-4">
          <input
            type="radio"
            name="method"
            value="pickup"
            checked={method === "pickup"}
            onChange={() => setMethod("pickup")}
          />{" "}
          Pickup
        </label>
        <label>
          <input
            type="radio"
            name="method"
            value="delivery"
            checked={method === "delivery"}
            onChange={() => setMethod("delivery")}
          />{" "}
          Delivery
        </label>
      </div>

      {method === "delivery" && (
        <input
          type="text"
          placeholder="Address (include ZIP)"
          className="w-full border rounded p-2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      )}

      <input
        type="date"
        className="w-full border rounded p-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        className="w-full border rounded p-2"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      <button type="submit" className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white p-2 rounded">
        Submit Order
      </button>
    </form>
  );
}
