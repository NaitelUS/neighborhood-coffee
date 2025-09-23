import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onSubmit: (info: any) => void;
};

const isSunday = (d: Date) => d.getDay() === 0;

function clampToBusinessTime(dateStr: string, timeStr: string) {
  // Business: 6:00–11:00 AM
  const [h, m] = timeStr.split(":").map((n) => parseInt(n, 10));
  const ampm = timeStr.toLowerCase().includes("pm") ? "pm" : "am";
  const hr24 = ampm === "pm" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;

  const d = new Date(dateStr + " " + timeStr);
  const min = new Date(dateStr);
  min.setHours(6, 0, 0, 0);
  const max = new Date(dateStr);
  max.setHours(11, 0, 0, 0);

  if (d < min) return { ok: false, msg: "Please choose a time between 6:00 AM and 11:00 AM." };
  if (d > max) return { ok: false, msg: "Please choose a time between 6:00 AM and 11:00 AM." };
  return { ok: true, msg: "" };
}

export default function CustomerInfoForm({ onSubmit }: Props) {
  const now = useMemo(() => new Date(), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");

  const [date, setDate] = useState<string>(() => {
    const y = now.getFullYear();
    const m = `${now.getMonth() + 1}`.padStart(2, "0");
    const d = `${now.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  const [time, setTime] = useState<string>(() => {
    const hrs = now.getHours();
    const mins = now.getMinutes();
    const h = ((hrs + 11) % 12) + 1;
    const ampm = hrs >= 12 ? "PM" : "AM";
    return `${`${h}`.padStart(2, "0")}:${`${mins}`.padStart(2, "0")} ${ampm}`;
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Si cae en domingo, avisa y no permite enviar
    if (isSunday(new Date(date))) {
      setError(
        "We’re closed on Sundays. Please choose a weekday between 6:00 AM and 11:00 AM."
      );
    } else {
      setError("");
    }
  }, [date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Bloquear domingo
    if (isSunday(new Date(date))) {
      setError(
        "We’re closed on Sundays. Please choose a weekday between 6:00 AM and 11:00 AM."
      );
      return;
    }

    // Bloquear fuera de 6–11am
    const t = clampToBusinessTime(date, time);
    if (!t.ok) {
      setError(
        "We take orders from 6:00 AM to 11:00 AM only. Thanks for understanding! (And no, we still can’t send coffee back to the past ☺)"
      );
      return;
    }

    setError("");

    onSubmit({
      name,
      email,
      phone,
      method,
      address: method === "delivery" ? address : "",
      zip: method === "delivery" ? zip : "",
      date,
      time,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="w-full border rounded px-2 py-1"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="w-full border rounded px-2 py-1"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full border rounded px-2 py-1"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <div className="mt-3">
        <p className="font-semibold mb-1">Choose your delivery method</p>
        <label className="mr-4">
          <input
            type="radio"
            name="method"
            className="mr-1"
            checked={method === "pickup"}
            onChange={() => setMethod("pickup")}
          />
          Pickup
        </label>
        <label>
          <input
            type="radio"
            name="method"
            className="mr-1"
            checked={method === "delivery"}
            onChange={() => setMethod("delivery")}
          />
          Delivery
        </label>
      </div>

      {method === "delivery" && (
        <>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Street address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="ZIP code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </>
      )}

      {/* Fecha y hora */}
      <div className="grid grid-cols-2 gap-2">
        <input
          className="w-full border rounded px-2 py-1"
          type="date"
          value={date}
          min={date} // hoy o mayor
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          className="w-full border rounded px-2 py-1"
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g. 09:30 AM"
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white" type="submit">
        Submit Order
      </Button>

      {/* Información de tienda (trae de vuelta lo que faltaba) */}
      <div className="mt-6 text-sm text-center">
        <p className="font-bold">The Neighborhood Coffee</p>
        <p>12821 Little Misty Ln</p>
        <p>El Paso, Texas 79938</p>
        <p>+1 (915) 401-5547</p>
        <p className="mt-2 font-semibold">
          We’re open weekdays, except Sundays
        </p>
        <p className="font-semibold">6:00 AM – 11:00 AM</p>
        <p className="mt-2 italic font-semibold text-[#E5A645]">
          More than coffee, it’s a neighborhood tradition, from our home to yours.
        </p>
        <p className="mt-3 font-bold">We accept Zelle, Cash App & Cash</p>
      </div>
    </form>
  );
}
