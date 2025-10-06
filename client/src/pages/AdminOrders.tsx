<div className="flex flex-col sm:flex-row flex-wrap gap-3">
  <button
    onClick={() => updateStatus(o.id, "Received")}
    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold"
  >
    📦 Received
  </button>
  <button
    onClick={() => updateStatus(o.id, "In Progress")}
    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold"
  >
    ☕ In Progress
  </button>
  <button
    onClick={() => updateStatus(o.id, "Ready")}
    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
  >
    ✅ Ready
  </button>
  {o.order_type === "Delivery" && (
    <button
      onClick={() => updateStatus(o.id, "Out for Delivery")}
      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold"
    >
      🚚 Out for Delivery
    </button>
  )}
  <button
    onClick={() => updateStatus(o.id, "Completed")}
    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
  >
    🎉 Completed
  </button>
  <button
    onClick={() => updateStatus(o.id, "Cancelled")}
    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
  >
    ❌ Cancelled
  </button>
</div>
