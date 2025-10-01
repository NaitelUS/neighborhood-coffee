import React, { useState } from "react";

interface CustomerInfo {
  name: string;
  phone: string;
  method: "Pickup" | "Delivery";
  address?: string;
}

interface Props {
  onSubmit: (info: CustomerInfo, schedule: string) => void;
}

export default function CustomerInfoForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<CustomerInfo>({
    name: "",
    phone: "",
    method: "Pickup", // ✅ default
    address: "",
  });

  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // ✅ Lunes a Sábado
  const isDateAllowed = (d: string) => {
    const day = new Date(d).getDay();
    return day >= 1 && day <= 6; // 0 = Domingo, 6 = Sábado
  };

  // ✅ 6:00 AM a 11:00 AM
  const isTimeAllowed = (t: string) => {
    const [hours] = t.split(":").map(Number);
    return hours >= 6 && hours < 11;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      alert("Please select a valid date and time.");
      return;
    }

    if (!isDateAllowed(date)) {
      alert("Orders can only be scheduled from Monday to Saturday.");
      return;
    }

    if (!isTimeAllowed(time)) {
      alert("Orders must be between 6:00 AM and 11:00 AM.");
      return;
    }

    const combined = new Date(`${date}T${time}:00`).toISOString();

    onSubmit(formData, combined);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Customer Information</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        className="w-full border rounded-lg p-2"
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
        className="w-full border rounded-lg p-2"
      />

      {/* ✅ Pickup / Delivery */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="method"
            value="Pickup"
            checked={formData.method === "Pickup"}
            onChange={(e) => setFormData({ ...formData, method: e.target.value as "Pickup" })}
          />
          Pickup
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="method"
            value="Delivery"
            checked={formData.method === "Delivery"}
            onChange={(e) => setFormData({ ...formData, method: e.target.value as "Delivery" })}
          />
          Delivery
        </label>
      </div>

      {/* ✅ Address visible solo si Delivery */}
      {formData.method === "Delivery" && (
        <input
          type="text"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          className="w-full border rounded-lg p-2"
        />
      )}

      {/* 📅 Fecha */}
      <div>
        <label className="block text-gray-700 mb-1">Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* ⏰ Hora */}
      <div>
        <label className="block text-gray-700 mb-1">Select Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* 🚀 Submit */}
      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold"
      >
        Continue
      </button>
    </form>
  );
}
