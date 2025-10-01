import React, { useState, useEffect } from "react";

interface CustomerInfo {
  name: string;
  phone: string;
  method: "pickup" | "delivery";
  address?: string;
}

interface CustomerInfoFormProps {
  onInfoChange: (info: CustomerInfo) => void;
}

export default function CustomerInfoForm({ onInfoChange }: CustomerInfoFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");

  // 🔄 Emitir cambios al componente padre
  useEffect(() => {
    onInfoChange({ name, phone, method, address: method === "delivery" ? address : undefined });
  }, [name, phone, method, address]);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Customer Information
      </h2>

      {/* 👤 Nombre */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* 📱 Teléfono */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(555) 123-4567"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* 🚚 Método: Pickup / Delivery */}
      <div className="mb-4">
        <p className="block text-sm font-medium text-gray-700 mb-2">
          How would you like to receive your order?
        </p>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="pickup"
              checked={method === "pickup"}
              onChange={() => setMethod("pickup")}
              className="accent-amber-600"
            />
            <span>Pickup (default)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="delivery"
              checked={method === "delivery"}
              onChange={() => setMethod("delivery")}
              className="accent-amber-600"
            />
            <span>Delivery</span>
          </label>
        </div>
      </div>

      {/* 🏠 Dirección (solo si elige Delivery) */}
      {method === "delivery" && (
        <div className="mb-4 animate-fadeIn">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address <span className="text-red-500">*</span>
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            rows={2}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      )}
    </div>
  );
}
