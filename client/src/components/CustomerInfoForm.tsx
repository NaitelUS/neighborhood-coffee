import React, { useState } from "react";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

interface CustomerInfoFormProps {
  onSubmit: (info: any, schedule: string) => void;
}

export default function CustomerInfoForm({ onSubmit }: CustomerInfoFormProps) {
  const { cartItems } = useContext(CartContext);

  const [info, setInfo] = useState({
    name: "",
    phone: "",
    method: "Pickup", // Default
    address: "",
  });

  // ✅ Fecha y hora actual por defecto
  const now = new Date();
  const defaultDate = now.toISOString().split("T")[0];
  const defaultTime = now.toTimeString().slice(0, 5);

  const [scheduleDate, setScheduleDate] = useState(defaultDate);
  const [scheduleTime, setScheduleTime] = useState(defaultTime);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!info.name || !info.phone) {
      alert("Please fill out your name and phone number.");
      return;
    }

    if (info.method === "Delivery" && !info.address) {
      alert("Please enter your delivery address.");
      return;
    }

    const schedule = `${scheduleDate} ${scheduleTime}`;
    setLoading(true);

    // ⏳ Llama al callback
    onSubmit(info, schedule);

    // 🔒 Desactiva por 2s para evitar spam
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Customer Information
      </h2>

      {/* Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={info.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={info.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Pickup / Delivery */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Order Method
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="method"
              value="Pickup"
              checked={info.method === "Pickup"}
              onChange={handleChange}
            />
            Pickup
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="method"
              value="Delivery"
              checked={info.method === "Delivery"}
              onChange={handleChange}
            />
            Delivery
          </label>
        </div>
      </div>

      {/* Address (solo si Delivery) */}
      {info.method === "Delivery" && (
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={info.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
      )}

      {/* Fecha */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Select Date
        </label>
        <input
          type="date"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Hora */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Select Time
        </label>
        <input
          type="time"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
          min="06:00"
          max="11:00"
        />
        <p className="text-xs text-gray-500 mt-1">
          Available: 6:00 AM – 11:00 AM (Mon–Sat)
        </p>
      </div>

      {/* ✅ Botón Place Order */}
      <button
        type="submit"
        disabled={loading || cartItems.length === 0}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
          loading || cartItems.length === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#1D9099] hover:bg-[#00454E]"
        }`}
      >
        {loading ? "Submitting..." : "Place Order"}
      </button>
    </form>
  );
}
