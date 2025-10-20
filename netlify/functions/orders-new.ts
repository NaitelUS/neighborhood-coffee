export const createOrder = async (orderData: any) => {
  try {
    // Normalizamos los campos antes de enviarlos al backend
    const payload = {
      name: orderData.name || "",
      phone: orderData.phone || "",
      address: orderData.address || "",
      order_type: orderData.orderType || orderData.order_type || "",
      schedule_date: orderData.scheduleDate || orderData.schedule_date || "",
      schedule_time: orderData.scheduleTime || orderData.schedule_time || "",
      subtotal: Number(orderData.subtotal) || 0,
      discount: Number(orderData.discount) || 0,
      total: Number(orderData.total) || 0,
      coupon: orderData.coupon || "",
      notes: orderData.notes || "",
    };

    const res = await fetch("/.netlify/functions/orders-new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Order creation failed:", data);
      throw new Error(data.error || "Failed to create order");
    }

    return data;
  } catch (error) {
    console.error("Error submitting order:", error);
    throw new Error("There was an error submitting your order. Please try again.");
  }
};
