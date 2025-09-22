import { useState, useEffect } from "react";

type CustomerInfoFormProps = {
  onInfoChange: (info: any) => void;
};

export default function CustomerInfoForm({ onInfoChange }: CustomerInfoFormProps) {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    phone: "",
    isDelivery: false,
    address: "",
    preferredDate: "",
    preferredTime: "",
    specialNotes: "",
    coupon: "",
    addOnsEnabled: false,
  });

  useEffect(() => {
    onInfoChange(info);
  }, [info]);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const hh = String(today.getHours()).padStart(2, "0");
  const min = String(today.getMinutes()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  const formattedTime = `${hh}:${min}`;

  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold">Customer Information</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-2 border rounded"
        value={info.name}
        onChange={(e) => setInfo({ ...info, name: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email Address"
        className="w-full p-2 border rounded"
        value={info.email}
        onChange={(e) => setInfo({ ...info, email: e.target.value })}
        required
      />

      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full p-2 border rounded"
        value={info.phone}
        onChange={(e) => setInfo({ ...info, phone: e.target.value })}
        required
      />

      {/* Pickup / Delivery */}
      <div className="space-y-2">
        <label className="font-medium">Order Type:</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              checked={!info.isDelivery}
              onChange={() => setInfo({ ...info, isDelivery: false })}
            />{" "}
            Pickup
          </label>
          <label>
            <input
              type="radio"
              checked={info.isDelivery}
              onChange={() => setInfo({ ...info, isDelivery: true })}
            />{" "}
            Delivery
          </label>
        </div>
      </div>

      {info.isDelivery && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Delivery Address"
            className="w-full p-2 border rounded"
            value={info.address}
            onChange={(e) => setInfo({ ...info, address: e.target.value })}
          />
          <div className="text-sm text-gray-700">
            <b>The Neighborhood Coffee</b>
            <br />
            12821 Little Misty Ln
            <br />
            El Paso, Texas 79938
            <br />
            +1 (915) 401-5547 ☕
          </div>
        </div>
      )}

      {/* Date & Time */}
      <div className="flex gap-4">
        <input
          type="date"
          className="w-1/2 p-2 border rounded"
          min={formattedDate}
          value={info.preferredDate || formattedDate}
          onChange={(e) => setInfo({ ...info, preferredDate: e.target.value })}
        />
        <input
          type="time"
          className="w-1/2 p-2 border rounded"
          value={info.preferredTime || formattedTime}
          onChange={(e) => setInfo({ ...info, preferredTime: e.target.value })}
        />
      </div>

      <textarea
        placeholder="Special Notes"
        className="w-full p-2 border rounded"
        value={info.specialNotes}
        onChange={(e) => setInfo({ ...info, specialNotes: e.target.value })}
      />

      {/* Customize your drink */}
      <div className="mt-4">
        <label>
          <input
            type="checkbox"
            checked={info.addOnsEnabled}
            onChange={() => setInfo({ ...info, addOnsEnabled: !info.addOnsEnabled })}
          />{" "}
          Customize your drink
        </label>

        {info.addOnsEnabled && (
          <div className="mt-2 space-y-2 pl-4">
            {[
              { id: "extraShot", name: "Extra Espresso Shot", price: 0.75 },
              { id: "oatMilk", name: "Oat Milk", price: 0.5 },
              { id: "hazelnutSyrup", name: "Hazelnut Syrup", price: 0.5 },
              { id: "caramelSyrup", name: "Caramel Syrup", price: 0.5 },
              { id: "vanillaSyrup", name: "Vanilla Syrup", price: 0.5 },
              { id: "whippedCream", name: "Whipped Cream", price: 0.5 },
            ].map((addOn) => (
              <label key={addOn.id} className="block">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const currentAddOns = info.addOns || [];
                    if (e.target.checked) {
                      setInfo({ ...info, addOns: [...currentAddOns, addOn.id] });
                    } else {
                      setInfo({
                        ...info,
                        addOns: currentAddOns.filter((id) => id !== addOn.id),
                      });
                    }
                  }}
                />{" "}
                {addOn.name} (+${addOn.price.toFixed(2)})
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
