import React, { useState } from "react";
import dayjs from "dayjs";

interface CustomerInfoFormProps {
  onSubmit: (info: any, scheduleDate: string, scheduleTime: string) => void;
}

export default function CustomerInfoForm({ onSubmit }: CustomerInfoFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"Pickup" | "Delivery">("Pickup");
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState(dayjs().format("HH:mm")); // control interno

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    const formattedTime = dayjs(selectedTime, "HH:mm").format("hh:mm A"); // 12h AM/PM

    onSubmit(
      { name, phone, method, address },
      formattedDate,
      formattedTime
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Info</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="method"
            checked={method === "Pickup"}
            onChange={() => setMethod("Pickup")}
          />
          Pickup
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="method"
            checked={method === "Delivery"}
            onChange={() => setMethod("Delivery")}
          />
          Delivery
        </label>
      </div>

      {method === "Delivery" && (
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={dayjs().format("YYYY-MM-DD")}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Select Time</label>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white py-3 rounded-lg font-semibold"
      >
        Place Order
      </button>
    </form>
  );
}
