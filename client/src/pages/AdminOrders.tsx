import React, { useEffect, useState } from "react";

interface Order {
  id: string;
  fields: any;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/.netlify/functions/orders-get");
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to fetch orders");

      setOrders(data.records || []);
    } catch (err) {
      console.error(err);
      setError("⚠️ Unable to load orders right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "#00454E";
      case "In Progress":
        return "#1D9099";
      case "Completed":
        return "#9CA3AF"; // gray
      default:
        return "#00454E";
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#00454E]">Admin Orders</h2>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="bg-[#00454E] text-white px-4 py-2 rounded hover:bg-[#1D9099] transition"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {orders.length === 0 && !loading ? (
        <p className="text-gray-500 text-center mt-8">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const f = order.fields;
            const statusColor = getStatusColor(f.Status);

            return (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg p-4 border border-gray-100"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: statusColor }}
                  >
                    {f.OrderID || f.id}
                  </h3>
                  <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded">
                    {f.Status || "Received"}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="text-sm text-gray-700 mb-2">
                  <p>
                    <strong>{f.Name}</strong> — {f.Phone}
                  </p>
                  <p>
                    {f.OrderType}{" "}
                    {f.OrderType === "Delivery" && f.Address
                      ? `• ${f.Address}`
                      : ""}
                  </p>
                  {(f.ScheduleDate || f.ScheduleTime) && (
                    <p>
                      {f.ScheduleDate || ""} {f.ScheduleTime || ""}
                    </p>
                  )}
                  {f.Notes && <p className="italic text-gray-500">{f.Notes}</p>}
                </div>

                {/* Products */}
                {f.Items && (
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    {f.Items.split(";").map((item: string, idx: number) => (
                      <p key={idx} className="text-sm text-gray-800">
                        {item}
                      </p>
                    ))}
                  </div>
                )}

                {/* Totals */}
                <div className="border-t border-gray-200 mt-3 pt-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${(f.Subtotal || 0).toFixed(2)}</span>
                  </div>
                  {f.Discount && f.Discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>
                        Discount{" "}
                        {f.Coupon ? (
                          <>
                            ({f.Coupon} – {(f.Discount * 100).toFixed(0)}%)
                          </>
                        ) : (
                          ""
                        )}
                      </span>
                      <span>
                        – ${(f.Subtotal * (f.Discount || 0)).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-[#00454E] text-base mt-1">
                    <span>Total:</span>
                    <span>${(f.Total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
