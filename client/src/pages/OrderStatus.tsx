import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  ProductName: string;
  Quantity: number;
  Price: number;
  Option?: string;
  AddOns?: string[];
}

interface OrderData {
  id?: string;
  name?: string;
  total?: number;
  discount?: number;
  coupon_code?: string;
  status?: string;
  items?: OrderItem[];
}

export default function OrderStatus() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch("/.netlify/functions/orders-get");
        const data = await res.json();
        const found = data.find((o: any) => o.id === orderId);
        setOrder(found);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">Loading order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          Order not found
        </h1>
        <Link
          to="/"
          className="text-blue-600 underline hover:text-blue-800 font-medium"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // 🟢 Etiqueta visual de estado
  const statusColor: Record<string, string> = {
    received: "bg-yellow-100 text-yellow-800",
    "in progress": "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
    "out for delivery": "bg-teal-100 text-teal-800",
  };

  const normalizedStatus = order.status?.toLowerCase() || "received
