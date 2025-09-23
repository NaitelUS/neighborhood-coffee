import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { addOnOptions } from "@/data/menuData";

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const raw = localStorage.getItem(`order-${id}`);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const normalized = (parsed.items || []).map((it: any) => {
      const ids = Array.isArray(it.addOns) ? it.addOns : [];
      const objects =
        ids.length && typeof ids[0] === "string"
          ? ids
              .map((aid: string) => addOnOptions.find((a) => a.id === aid))
              .filter(Boolean)
              .map((a) => ({ id: a!.id, name: a!.name, price: a!.price }))
          : ids;
      return { ...it, addOns: objects || [] };
    });

    setOrder({ ...parsed, items: normalized });
  }, [id]);

  if (!order) return <p className="p-6">Order not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Order Status</h1>
      <p className="mb-1">Order <strong>#{id}</strong></p>
      <p className="mb-4">Current status: <strong>{order.status || "☕ Received"}</strong></p>

      <div className="border rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <ul className="space-y-3">
          {order.items.map((item: any, idx: number) => {
            const addOnTotal = (item.addOns || []).reduce((s: number, a: any) => s + Number(a.price || 0), 0);
            const lineTotal = (Number(item.basePrice || 0) + addOnTotal) * Number(item.quantity || 0);
            return (
              <li key={idx} className="border-b pb-2 last:border-none last:pb-0">
                <div className="flex justify-between">
                  <span>
                    {item.quantity}× {item.name}
                    {item.temperature && ` (${item.temperature})`}
                    {item.option && ` - ${item.option}`}
                  </span>
                  <span>${lineTotal.toFixed(2)}</span>
                </div>
                {(item.addOns && item.addOns.length > 0) && (
                  <ul className="ml-4 list-disc text-sm text-gray-700">
                    {item.addOns.map((a: any) => (
                      <li key={a.id}>
                        {a.name} (+${Number(a.price || 0).toFixed(2)})
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${Number(order.subtotal || 0).toFixed(2)}</span>
          </div>
          {Number(order.discount || 0) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>- ${Number(order.discount || 0).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Total:</span>
            <span>${Number(order.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
