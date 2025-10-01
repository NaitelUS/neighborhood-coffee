import React, { useState } from "react";

export default function CustomerInfoForm() {
  const [deliveryMethod, setDeliveryMethod] = useState("Pickup");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Name</label>
        <input className="border p-2 w-full rounded" placeholder="Your name" />
      </div>

      <div>
        <label className="block font-semibold mb-1">Phone</label>
        <input
          type="tel"
          className="border p-2 w-full rounded"
          placeholder="Your phone number"
        />
      </div>

      {/* Pickup/Delivery */}
      <div>
        <label className="block font-semibold mb-1">Pickup or Delivery</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              value="Pickup"
              checked={deliveryMethod === "Pickup"}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            />{" "}
            Pickup
          </label>
          <label>
            <input
              type="radio"
              value="Delivery"
              checked={deliveryMethod === "Delivery"}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            />{" "}
            Delivery
          </label>
        </div>
        {deliveryMethod === "Delivery" && (
          <input
            type="text"
            placeholder="Enter delivery address"
            className="mt-3 w-full border p-2 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        )}
      </div>

      {/* Schedule */}
      <div>
        <label className="block font-semibold mb-1">Schedule your order</label>
        <div className="flex gap-4">
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="time"
            min="06:00"
            max="11:00"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
}
