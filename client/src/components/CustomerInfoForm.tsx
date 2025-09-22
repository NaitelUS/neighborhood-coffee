// src/components/CustomerInfoForm.tsx
import { useEffect, useMemo, useState } from "react";
import { COUPON_CODE } from "@/data/menuData";

type Props = {
  onInfoChange: (info: any) => void;
  onCouponApplied: (applied: boolean) => void;
};

export default function CustomerInfoForm({ onInfoChange, onCouponApplied }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");

  const [preferredDate, setPreferredDate] = useState<string>("");
  const [preferredTime, setPreferredTime] = useState<string>("");

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMsg, setCouponMsg] = useState<string>("");

  // Hoy por defecto + bloquear domingos
  useEffect(() => {
    const today = new Date();
    const ymd = today.toISOString().split("T")[0];
    setPreferredDate(ymd);

    // Hora actual clamp a rango 06:00 - 11:30 (pasos de 30 min)
    const minutes = today.getMinutes();
    const rounded = minutes < 30 ? 0 : 30;
    const clampedH = Math.min(Math.max(today.getHours(), 6), 11);
    const clampedM = clampedH === 11 ? Math.min(rounded, 30) : rounded;
    const hh = String(clampedH).padStart(2, "0");
    const mm = String(clampedM).padStart(2, "0");
    setPreferredTime(`${hh}:${mm}`);
  }, []);

  // Notificar cambios al padre
  useEffect(() => {
    onInfoChange({
      name,
      email,
      phone,
      isDelivery: fulfillment === "delivery",
      address: fulfillment === "delivery" ? address : "",
      preferredDate,
      preferredTime,
      couponApplied,
    });
  }, [name, email, phone, fulfillment, address, preferredDate, preferredTime, couponApplied, onInfoChange]);

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === COUPON_CODE) {
      setCouponApplied(true);
      onCouponApplied(true);
      setCouponMsg("Coupon applied: 15% off");
    } else {
      setCouponApplied(false);
      onCouponApplied(false);
      setCouponMsg("Coupon not valid");
    }
  };

  const isSunday = (d: string) => {
    if (!d) return false;
    const dt = new Date(d + "T00:00:00");
    return dt.getDay() === 0; // 0 = Sunday
  };

  const clampTime = (value: string) => {
    if (!value) return value;
    const [h, m] = value.split(":").map((n) => parseInt(n));
    let hh = Math.max(6, Math.min(11, h));
    let mm = m;
    if (hh === 11) mm = Math.min(m, 30);
    const out = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    return out;
  };

  return (
    <div className="border rounded-xl p-4 space-y-4 bg-card">
      <h3 className="text-lg font-semibold">Contact Information</h3>

      {/* Siempre visible: datos de la tienda */}
      <div className="text-sm p-3 bg-muted rounded">
        <p><strong>The Neighborhood Coffee</strong></p>
        <p>12821 Little Misty Ln</p>
        <p>El Paso, Texas 79938</p>
        <p>+1 (915) 401-5547 ☕</p>
        <p className="mt-2 text-[#00454E]">
          Servimos de lunes a sábado de 6:00am a 11:00am. Los domingos descansamos. ☀️
        </p>
      </div>

      {/* Datos del cliente */}
      <div className="grid gap-3">
        <input
          className="border rounded px-3 py-2"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Pickup / Delivery */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="fulfillment"
              value="pickup"
              checked={fulfillment === "pickup"}
              onChange={() => setFulfillment("pickup")}
            />
            <span>Pickup</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="fulfillment"
              value="delivery"
              checked={fulfillment === "delivery"}
              onChange={() => setFulfillment("delivery")}
            />
            <span>Delivery</span>
          </label>
        </div>

        {fulfillment === "delivery" && (
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Address for delivery"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        )}
      </div>

      {/* Fecha y hora (mismo renglón) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm block mb-1">Preferred Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full"
            value={preferredDate}
            onChange={(e) => {
              const v = e.target.value;
              if (isSunday(v)) {
                // limpia si es domingo
                e.target.value = "";
                setPreferredDate("");
                return;
              }
              setPreferredDate(v);
            }}
            min={new Date().toISOString().split("T")[0]}
          />
          <p className="text-xs text-muted-foreground mt-1">* Domingos no disponibles</p>
        </div>
        <div>
          <label className="text-sm block mb-1">Preferred Time</label>
          <input
            type="time"
            className="border rounded px-3 py-2 w-full"
            value={preferredTime}
            min="06:00"
            max="11:30"
            step={1800} // 30 min
            onChange={(e) => setPreferredTime(clampTime(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">* Solo entre 6:00 y 11:30 (cada 30 min)</p>
        </div>
      </div>

      {/* Cupón */}
      <div className="pt-2">
        <label className="text-sm block mb-1">Coupon</label>
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="Enter coupon code"
            value={coupon}
            disabled={couponApplied}
            onChange={(e) => setCoupon(e.target.value)}
          />
        <button
          className={`px-3 rounded ${couponApplied ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#1D9099] hover:bg-[#00454E] text-white"}`}
          onClick={handleApplyCoupon}
          disabled={couponApplied}
        >
          Apply
        </button>
        </div>
        {couponMsg && (
          <p className={`text-sm mt-1 ${couponApplied ? "text-green-700" : "text-red-600"}`}>
            {couponMsg}
          </p>
        )}
      </div>
    </div>
  );
}
