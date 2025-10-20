const fetchOrders = async () => {
  try {
    const res = await fetch("/.netlify/functions/orders-get");
    const data = await res.json();
    if (!Array.isArray(data)) return;

    // 🧩 Normalizamos nombres de campos
    const normalized = data.map((o) => ({
      id: o.id,
      orderID: o.orderID,
      name: o.name,
      phone: o.phone,
      OrderType: o.order_type || o.OrderType || "",
      Status: o.status || o.Status || "",
      total: o.total || 0,
      subtotal: o.subtotal || 0,
      discount: o.discount || 0,
      coupon: o.coupon || "",
      Date: o.schedule_date || o.Date || "",
      items: o.items || [],
    }));

    // 🔔 sonido para nuevas órdenes recibidas
    const newReceived = normalized.filter(
      (o) =>
        o.Status === "Received" &&
        !lastOrderIds.current.includes(o.id)
    );
    if (newReceived.length > 0) {
      const sound = new Audio("/sounds/new-order.mp3");
      sound.play().catch(() => {});
    }

    lastOrderIds.current = normalized.map((o) => o.id);
    setOrders(normalized);
  } catch (err) {
    console.error("Error fetching orders:", err);
  } finally {
    setLoading(false);
  }
};
