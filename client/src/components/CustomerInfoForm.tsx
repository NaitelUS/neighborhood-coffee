import React, { useState } from "react";

const CustomerInfoForm: React.FC = () => {
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [address, setAddress] = useState("");

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Your Info</h2>
      <input
        type="text"
        placeholder="Full Name"
        className="border rounded px-2 py-1 w-full mb-3"
      />
      <input
        type="text"
        placeholder="Phone Number"
        className="border rounded px-2 py-1 w-full mb-3"
      />

      <p className="font-semibold mb-2">Delivery Method</p>
      <div className="flex gap-4 mb-4">
        <label>
          <input
            type="radio"
            value="pickup"
            checked={deliveryMethod === "pickup"}
            onChange={() => setDeliveryMethod("pickup")}
          />{" "}
          Pick Up
        </label>
        <label>
          <input
            type="radio"
            value="delivery"
            checked={deliveryMethod === "delivery"}
            onChange={() => setDeliveryMethod("delivery")}
          />{" "}
          Delivery
        </label>
      </div>

      {deliveryMethod === "delivery" && (
        <input
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-3"
        />
      )}

      <input
        type="date"
        className="border rounded px-2 py-1 w-full mb-3"
        defaultValue={new Date().toISOString().split("T")[0]}
      />
      <input
        type="time"
        className="border rounded px-2 py-1 w-full mb-3"
        defaultValue={new Date().toISOString().slice(11, 16)}
      />
    </div>
  );
};

export default CustomerInfoForm;
