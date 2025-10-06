import React, { useState } from "react";
import dayjs from "dayjs";

interface CustomerInfoFormProps {
  onSubmit: (info: any, schedule_date: string, schedule_time: string) => void;
}

export default function CustomerInfoForm({ onSubmit }: CustomerInfoFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"Pickup" | "Delivery">("Pickup");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [time, setTime] = useState(dayjs().format("HH:mm"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      alert("Please enter your name and phone number.");
      return;
    }

    if (method === "Delivery" && !address) {
      alert("Please enter your delivery address.");
      return;
    }

    // 🚀 Mandamos fecha y hora por separado
    onSubmit({ name, phone, method, address }, date, time);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 flex flex-col space-y-5"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Customer Information
      </h2>

      {/* 🧍 Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Your full name"
          required
        />
      </div>

      {/* ☎️ Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="(123) 456-7890"
          required
        />
      </div>

      {/* 🚚 Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Order Type
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Pickup"
              checked={method === "Pickup"}
              onChange={() => setMethod("Pickup")}
            />
            Pickup
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Delivery"
              checked={method === "Delivery"}
              onChange={() => setMethod("Delivery")}
            />
            Delivery
          </label>
        </div>
      </div>

      {/* 📍 Address (solo Delivery) */}
      {method === "Delivery" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Street, neighborhood, etc."
          />
        </div>
      )}

      {/* 📅 Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
          </label>
          <input
            type="date"
            value={date}
            min={dayjs().format("YYYY-MM-DD")}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      
{/* 📝 Special Instructions */}
      <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">
      Special Instructions (optional)
      </label>
      <textarea
        name="notes"
        placeholder="Example: Leave order outside, No sugar, extra shot..."
        value={formData.notes || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-500"
        rows={3}
  />
</div>

      {/* ✅ Submit */}
      <button
        type="submit"
        className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white py-3 rounded-lg font-semibold transition-all"
      >
        Place Order
      </button>
    </form>
  );
}
