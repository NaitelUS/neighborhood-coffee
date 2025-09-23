import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  items: { name: string; quantity: number; addOns?: { name: string; price: number }[] }[];
  status: "received" | "in-process" | "ready" | "delivered";
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  // Simulación de fetch de órdenes (puedes conectar con localStorage o API)
  useEffect(() => {
    const storedOrders = localStorage.getItem("admin-orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Demo con una orden fake
      setOrders([
        {
          id: "1001",
          name: "John Doe",
          phone: "915-555-1234",
          address: "123 Main St",
          date: "2025-09-25",
          time: "08:30",
          items: [
            { name: "Latte", quantity: 2, addOns: [{ name: "Extra Shot", price: 0.5 }] },
            { name: "Croissant", quantity: 1 },
          ],
          status: "received",
        },
      ]);
    }
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem("admin-orders", JSON.stringify(orders));
  }, [orders]);

  const updateStatus = (id: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const statusFlow: Order["status"][] = ["received", "in-process", "ready", "delivered"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-3 py-2">Order #</th>
                <th className="border px-3 py-2">Customer</th>
                <th className="border px-3 py-2">Phone</th>
                <th className="border px-3 py-2">Address</th>
                <th className="border px-3 py-2">Delivery Date</th>
                <th className="border px-3 py-2">Delivery Time</th>
                <th className="border px-3 py-2">Items</th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{order.id}</td>
                  <td className="border px-3 py-2">{order.name}</td>
                  <td className="border px-3 py-2">{order.phone}</td>
                  <td className="border px-3 py-2">{order.address}</td>
                  <td className="border px-3 py-2">{order.date}</td>
                  <td className="border px-3 py-2">{order.time}</td>
                  <td className="border px-3 py-2">
                    <ul className="list-disc pl-4">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.quantity}× {item.name}
                          {item.addOns?.length > 0 && (
                            <ul className="ml-4 text-xs text-gray-600 list-disc">
                              {item.addOns.map((add, j) => (
                                <li key={j}>
                                  {add.name} (+${add.price.toFixed(2)})
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-3 py-2">
                    <div className="flex gap-2 flex-wrap">
                      {statusFlow.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order.id, s)}
                          className={`px-2 py-1 rounded text-xs ${
                            order.status === s
                              ? "bg-brown-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
