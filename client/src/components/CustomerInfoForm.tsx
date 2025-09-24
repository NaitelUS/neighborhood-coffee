import { useState } from "react";

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export default function CustomerInfoForm() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mt-4 border rounded p-4 bg-white shadow">
      <h2 className="text-lg font-bold mb-2">Customer Info</h2>

      {/* Nombre */}
      <label className="block text-sm font-medium">Name</label>
      <input
        type="text"
        name="name"
        value={customerInfo.name}
        onChange={handleChange}
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="Your name"
        required
      />

      {/* Teléfono */}
      <label className="block text-sm font-medium">Phone</label>
      <input
        type="tel"
        name="phone"
        value={customerInfo.phone}
        onChange={handleChange}
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="Your phone number"
        required
      />

      {/* Email */}
      <label className="block text-sm font-medium">Email</label>
      <input
        type="email"
        name="email"
        value={customerInfo.email}
        onChange={handleChange}
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="you@example.com"
      />

      {/* Notas */}
      <label className="block text-sm font-medium">Notes</label>
      <textarea
        name="notes"
        value={customerInfo.notes}
        onChange={handleChange}
        className="w-full border rounded px-2 py-1"
        rows={2}
        placeholder="Special instructions (e.g., no sugar, ring the bell)"
      />
    </div>
  );
}
