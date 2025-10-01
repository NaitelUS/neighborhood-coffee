import React, { useState, useEffect } from "react";

interface CustomerInfoFormProps {
  onSubmit: (info: any, schedule: string) => void;
}

export default function CustomerInfoForm({ onSubmit }: CustomerInfoFormProps) {
  const [info, setInfo] = useState({
    name: "",
    phone: "",
    method: "Pickup",
    address: "",
  });

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().slice(0, 5));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schedule = `${date} ${time}`;
    onSubmit(info, schedule);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h3 className="text-xl font-semibold text-gray-800">Your Info</h3>

      <input
        type="text"
        placeholder="Full name"
        value={info.name}
        onChange={(e) => setInfo({ ...info, name: e.target.value })}
        className="w-full border rounded-md p-2"
        required
      />

      <input
        type="tel"
        placeholder="Phone number"
        value={info.phone}
        onChange={(e) => setInfo({ ...info, phone: e.target.value })}
        className="w-full border rounded-md p-2"
        required
      />

      <div className="flex gap-4">
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
          value={info.address}
          onChange={(e) => setInfo({ ...info, address: e.target.value })}
          className="w-full border rounded-md p-2"
          required
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-md p-2"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border rounded-md p-2"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-[#1D9099] text-white rounded-md hover:bg-[#00454E]"
      >
        Continue
      </button>
    </form>
  );
}
