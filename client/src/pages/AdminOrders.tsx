import { useState, useEffect } from "react";

const ORDER_STATUSES = [
  "Pending",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Completed",
  "Cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch("/.netlify/functions/orders-update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      loadOrders();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const exportCSV = () => {
    if (!orders.length) return alert("No orders to export.");

    const headers = [
      "Order ID",
      "Customer",
      "Phone",
      "Email",
      "Address",
      "Status",
      "Total",
      "Discount",
      "Subtotal",
      "Created",
    ];

    const rows = orders.map((o) => [
      o.id,
      o.customerName || "",
      o.phone || "",
      o.email || "",
      o.address || "",
      o.status || "",
      o.total || "",
      o.discount || "",
      o.subtotal || "",
      o.Created || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2
