// client/src/pages/AdminOrders.tsx
import { useEffect, useState } from "react";

interface Order {
  id: string;
  Customer?: string;
  Phone?: string;
  Address?: string;
  Total?: number;
  Discount?: number;
  Status?: string;
  Created?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer", "Phone", "Address", "Total", "Discount", "Status", "Created"];
    const rows = orders.map((o) => [
      o.id,
      o.Customer || "",
      o.Phone || "",
      o.Address || "",
      o.Total || "",
      o.Discount || "",
      o.Status || "",
      o.Created || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `orders_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, Status: newStatus }),
      });
      fetchOrders(); // Refresh
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Orders</h1>
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Discount</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="border p-2">{o.id}</td>
                  <td className="border p-2">{o.Customer}</td>
                  <td className="border p-2">{o.Phone}</td>
                  <td className="border p-2">{o.Address}</td>
                  <td className="border p-2">${o.Total?.toFixed(2)}</td>
                  <td className="border p-2">{o.Discount}%</td>
                  <td className="border p-2 font-semibold">{o.Status}</td>
                  <td className="border p-2">
                    {["Submitted", "In Process", "Ready", "Completed", "Cancelled"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(o.id, status)}
                          className={`text-xs px-2 py-1 mr-1 rounded ${
                            o.Status === status
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
