import { useState } from "react";

interface Props {
  onSubmit: (info: any) => void;
}

export default function CustomerInfoForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("pickup");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const validateDateTime = () => {
    const selected = new Date(`${date}T${time}`);
    const now = new Date();

    if (!date || !time) return "Please select both date and time.";

    const day = selected.getDay();
    if (day === 0) {
      return "Sorry, we rest on Sundays. Even coffee needs a day off ☕💤.";
    }

    const hours = selected.getHours();
    const minutes = selected.getMinutes();
    if (hours < 6 || (hours === 11 && minutes > 0) || hours > 11) {
      return "We’re only serving coffee between 6:00 AM and 11:00 AM. Come a bit earlier — we’ll keep the coffee warm for you!";
    }

    if (selected < now) {
      return "You can’t go back in time… unless it’s with an espresso 😉.";
    }

    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateDateTime();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    onSubmit({ name, email, phone, method, address, date, time });
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="order-form"
      className="border rounded-lg p-4 shadow-sm mt-6"
    >
      <h2 className="text-lg font-semibold mb-3">Your Info</h2>
      <input
        type="text"
        placeholder="Name"
        className="w-full border rounded p-2 mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border rounded p-2 mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        className="w-full border rounded p-2 mb-3"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <p className="font-medium mb-2">Delivery Method</p>
      <div className="flex gap-4 mb-3">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="pickup"
            checked={method === "pickup"}
            onChange={() => setMethod("pickup")}
          />
          Pickup
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="delivery"
            checked={method === "delivery"}
            onChange={() => setMethod("delivery")}
          />
          Delivery
        </label>
      </div>

      {method === "delivery" && (
        <input
          type="text"
          placeholder="Delivery Address + ZIP"
          className="w-full border rounded p-2 mb-3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      )}

      <input
        type="date"
        className="w-full border rounded p-2 mb-3"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        className="w-full border rounded p-2 mb-3"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button
        type="submit"
        className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white py-2 rounded"
      >
        Submit Order
      </button>
    </form>
  );
}
