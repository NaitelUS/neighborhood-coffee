const { getAirtableClient } = require("../lib/airtableClient");

exports.handler = async (event) => {
  try {
    // Permitir solo POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Parsear body del request
    const body = JSON.parse(event.body || "{}");
    const {
      name,
      phone,
      address,
      order_type,
      schedule_date,
      schedule_time,
      subtotal,
      discount,
      total,
      coupon,
      notes,
      items,
    } = body;

    // Validar campos obligatorios
    if (!name || !order_type || subtotal == null || total == null) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields", received: body }),
      };
    }

    const base = getAirtableClient();
    const ordersTable = base("Orders");
    const orderItemsTable = base("OrderItems");

    // Obtener el último OrderNumber para crear un consecutivo
    const last = await ordersTable
      .select({
        fields: ["OrderNumber"],
        sort: [{ field: "OrderNumber", direction: "desc" }],
        maxRecords: 1,
      })
      .firstPage();

    const lastNumber = last.length ? Number(last[0].fields.OrderNumber || 0) : 0;
    const newOrderNumber = lastNumber + 1;
    const newOrderID = `TNC-${String(newOrderNumber).padStart(3, "0")}`;

    // Crear la orden principal
    const orderRecord = await ordersTable.create([
      {
        fields: {
          Name: name,
          Phone: phone || "",
          Address: address || "",
          OrderType: order_type,
          ScheduleDate: schedule_date || "",
          ScheduleTime: schedule_time || "",
          Subtotal: Number(subtotal) || 0,
          Discount: Number(discount) || 0,
          Total: Number(total) || 0,
          Coupon: coupon || "",
          Notes: notes || "",
          Status: "Received",
          OrderNumber: newOrderNumber,
          OrderID: newOrderID,
          Date: new Date().toISOString(),
        },
      },
    ]);

    // Crear los ítems asociados (OrderItems)
    if (Array.isArray(items) && items.length > 0) {
      const orderItems = items.map((it) => ({
        fields: {
          ProductName: it.name || "",
          Option: it.option || "",
          Price: Number(it.price) || 0,
          Qty: Number(it.qty) || 1,
          AddOns: Array.isArray(it.addons)
            ? it.addons.join(", ")
            : (it.addons || ""),
          OrderID: newOrderID,
        },
      }));

      // 🔥 Crear todos los ítems en lote
      await orderItemsTable.create(orderItems);
    }

    // ✅ Respuesta correcta al frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Order created successfully",
        orderID: newOrderID,
      }),
    };
  } catch (error) {
    console.error("❌ orders-new error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};
