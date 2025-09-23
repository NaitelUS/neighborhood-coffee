import React, { useState } from "react";

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  date: string;
  time: string;
}

const CustomerInfoForm: React.FC<{ onSubmit: (info: CustomerInfo) => void }> = ({
  onSubmit,
}) => {
  const [form, setForm] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderDate = new Date(`${form.date}T${form.time}`);
    const now = new Date();

    // Bloqueo de fechas pasadas
    if (orderDate < now) {
      setError("😅 Sorry, you can't order in the past!");
      return;
    }

    // Bloqueo de domingos
    if (orderDate.getDay() === 0) {
      setError("🚫 We rest on Sundays – see you Monday morning!");
      return;
    }

    // Validación horario (6–11 am)
    const hour = orderDate.getHours();
    if (hour < 6 || hour >= 11) {
      setError("⏰ Orders only accepted between 6:00 AM and 11:00 AM.");
      return;
    }

    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md p-4 space-y-3">
      <h2 className="text-lg font-semibold">Your Info</h2>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        name="address"
        placeholder="Delivery Address"
        value={form.address}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-brown-600 hover:bg-brown-700 text-white px-4 py-2 rounded w-full"
      >
        Place Order
      </button>
    </form>
  );
};

export default CustomerInfoForm;
