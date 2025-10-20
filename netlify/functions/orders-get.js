const Airtable = require("airtable");

exports.handler = async (event) => {
  try {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
      process.env.AIRTABLE_BASE_ID
    );

    // Si viene un parámetro ?id=...
    const params = event.queryStringParameters || {};
    const orderIdParam = params.id;

    // Obtener todas las órdenes
    const orders = await base("Orders").select().all();

    // Obtener todos los items de las órdenes
    const orderItems = await base("OrderItems").select().all();

    // Relacionar los items con sus órdenes
    const itemsByOrder = {};
    orderItems.forEach((record) => {
      const orderId = record.fields.Order || record.fields.OrderID;
      if (!orderId) return;

      // Si "Order" es un link field, puede venir como array
      const linkedId = Array.isArray(orderId) ? orderId[0] : orderId;

      if (!itemsByOrder[linkedId]) itemsByOrder[linkedId] = [];

      itemsByOrder[linkedId].push({
        name: record.fields.Item || "",
        qty: record.fields.Qty || 1,
        addons: record.fields.Addons || [],
      });
    });

    // Mapear las órdenes con sus detalles
    const allOrders = orders.map((o) => ({
      id: o.id,
      orderID: o.fields.OrderID || "",
      name: o.fields.Name || "",
      phone: o.fields.Phone || "",
      order_type: o.fields.OrderType || "",
      Status: o.fields.Status || "",
      total: o.fields.Total || 0,
      subtotal: o.fields.Subtotal || 0,
      discount: o.fields.Discount || 0,
      coupon: o.fields.Coupon || "",
      schedule_date: o.fields.ScheduleDate || "",
      schedule_time: o.fields.ScheduleTime || "",
      items: itemsByOrder[o.id] || [],
    }));

    // Si se pide una orden específica
    if (orderIdParam) {
      const found = allOrders.find(
        (o) => o.orderID === orderIdParam || o.id === orderIdParam
      );
      if (!found) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Order not found" }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(found),
      };
    }

    // Si no hay parámetro, devolver todas
    return {
      statusCode: 200,
      body: JSON.stringify(allOrders),
    };
  } catch (err) {
    console.error("Error in orders-get.js:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message }),
    };
  }
};
