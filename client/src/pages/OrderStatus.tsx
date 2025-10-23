import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QuickContact from "../components/QuickContact";

export default function OrderStatus() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const t = setInterval(updateTime, 60000);
    return () => clearInterval(t);
  }, []);

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/.netlify/functions/orders-get?id=${orderId}`);
      const data = await res.json();
      if (data && !data.error) {
        setOrder(data);
        setError("");
      } else {
        setError(data.error || "Order not found");
      }
    } catch (err) {
      console.error(err);
      setError("Error loading order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const stepsPickup = ["Received", "In Process", "Ready", "Completed"];
  const stepsDelivery = ["Received", "In Process", "Out for Delivery", "Completed"];

  const getStepColor = (step: string, current: string) => {
    const idxStep = stepsPickup.indexOf(step);
    const idxCurrent = stepsPickup.indexOf(current);
    if (idxStep < idxCurrent) return "bg-[#00454E]";
    if (idxStep === idxCurrent) return "bg-[#007b87]";
    return "bg-gray-300";
  };

  const flow = order?.OrderType === "Delivery" ? stepsDelivery : stepsPickup;

  if (loading) return <p className="text-center mt-10">Loading order...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">⚠️ {error}</p>;

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-2 text-[#00454E]">☕ Order Status</h1>
      <p className="text-sm text-gray-500 mb-6">Today is {time}</p>

      <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">
          <b>Order #:</b> {order.orderID}
        </p>
        <p className="text-lg font-semibold mb-1 text-[#00454E]">
          {order.name}
        </p>
        <p className="text-gray-600 text-sm mb-4">
          {order.OrderType || "Pickup"}
        </p>
