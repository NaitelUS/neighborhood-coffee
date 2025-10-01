import React, { useState } from "react";

export default function CustomerInfoForm({ onSubmit }: { onSubmit: any }) {
  const [info, setInfo] = useState({
    name: "",
    phone: "",
    method: "Pickup",
    address: "",
  });

  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = useState<string>("08:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schedule = `${date} ${time}`;
    onSubmit(info, schedule);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Your Details
      </h2>

      <input
        type="text"
        placeholder="Full name"
        required
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        value={info.name}
        onChange={(e) => setInfo({ ...info, name: e.target.value })}
      />

      <input
        type="tel"
        placeholder="Phone number"
        required
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        value={info.phone}
        onChange={(e) => setInfo({ ...info, phone: e.target.value })}
      />

      {/* Pickup / Delivery */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="method"
            value="Pickup"
            checked={info.method === "Pickup"}
            onChange={() => setInfo({ ...info, method: "Pickup" })}
          />
          Pickup
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="method"
            value="Delivery"
            checked={info.method === "Delivery"}
            onChange={() => setInfo({ ...info, method: "Delivery" })}
          />
          Delivery
        </label>
      </div>

      {info.method === "Delivery" && (
        <input
          type="text"
          placeholder="Delivery address"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          value={info.address}
          onChange={(e) => setInfo({ ...info, address: e.target.value })}
        />
      )}

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Select Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            min="06:00"
            max="11:00"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary hover:bg-primaryHover text-white font-semibold py-3 rounded-lg mt-4"
      >
        Place Order
      </button>
    </form>
  );
}
