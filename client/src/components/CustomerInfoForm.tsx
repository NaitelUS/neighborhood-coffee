// src/components/CustomerInfoForm.tsx
import { useState } from "react";

interface Props {
  onInfoChange: (info: any) => void;
}

export default function CustomerInfoForm({ onInfoChange }: Props) {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    phone: "",
    isDelivery: false,
    address: "",
    preferredDate: "",
    preferredTime: "",
    specialNotes: "",
  });

  const handleChange = (field: string, value: any) => {
    const updated = { ...info, [field]: value };
    setInfo(updated);
    onInfoChange(updated);
  };

  // Bloquear domingos
  const disableSundays = (date: string) => {
    const d = new Date(date);
    return d.getDay() === 0;
  };

  // Fecha por default: hoy (si no es domingo)
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const defaultDate = disableSundays(todayStr)
    ? ""
    : todayStr;

  return (
    <div className="border rounded-lg p-4 bg-white shadow space-y-4">
      <h3 className="text-lg font-semibold mb-3">Customer Information</h3>

      {/* Name */}
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border rounded px-3 py-2 text-sm"
        value={info.name}
        onChange={(e) => handleChange("name", e.target.value)}
        required
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Email Address"
        className="w-full border rounded px-3 py-2 text-sm"
        value={info.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
      />

      {/* Phone */}
      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full border rounded px-3 py-2 text-sm"
        value={info.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        required
      />

      {/* Pickup or Delivery */}
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="orderType"
            checked={!info.isDelivery}
            onChange={() => handleChange("isDelivery", false)}
          />
          Pickup
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="orderType"
            checked={info.isDelivery}
            onChange={() => handleChange("isDelivery", true)}
          />
          Delivery
        </label>
      </div>

      {/* Address (only if delivery) */}
      {info.isDelivery && (
        <input
          type="text"
          placeholder="Delivery Address"
          className="w-full border rounded px-3 py-2 text-sm"
          value={info.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      )}

      {/* Café info */}
      <div className="text-sm mt-2">
        <p className="font-semibold">The Neighborhood Coffee</p>
        <p>12821 Little Misty Ln</p>
        <p>El Paso, Texas 79938</p>
        <p>+1 (915) 401-5547 ☕</p>
      </div>

      {/* Preferred Date */}
      <input
        type="date"
        className="w-full border rounded px-3 py-2 text-sm"
        value={info.preferredDate || defaultDate}
        onChange={(e) => {
          if (!disableSundays(e.target.value)) {
            handleChange("preferredDate", e.target.value);
          }
        }}
        min={todayStr}
      />

      {/* Preferred Time */}
      <input
        type="time"
        className="w-full border rounded px-3 py-2 text-sm"
        value={info.preferredTime}
        onChange={(e) => {
          const time = e.target.value;
          const [hours, minutes] = time.split(":").map(Number);
          if (hours >= 6 && (hours < 11 || (hours === 11 && minutes <= 30))) {
            handleChange("preferredTime", time);
          }
        }}
        step={300} // 5 min intervals
      />

      {/* Notes */}
      <textarea
        placeholder="Special Notes (optional)"
        className="w-full border rounded px-3 py-2 text-sm"
        rows={3}
        value={info.specialNotes}
        onChange={(e) => handleChange("specialNotes", e.target.value)}
      />
    </div>
  );
}
