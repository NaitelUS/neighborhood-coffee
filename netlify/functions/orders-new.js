const { getAirtableClient } = require("../lib/airtableClient");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
    }

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

    if (!name || !order_type || subtotal == null || total == null) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields", received: body }),
      };
    }

    const base = getAirtableClient();
    const ordersTable = base("Orders");
    const orderItemsTable = base("OrderItems");

    // Obtiene último OrderNumber para consecutivo robusto
    const last = await ordersTable
      .select({ fields: ["OrderNumber"], sort: [{ field: "OrderNumber", direction: "desc" }], maxRecords: 1 })
      .firstPage();

    const lastNumber = last.length ? Number(last[0].fields.OrderNumber || 0) : 0;
    const newOrderNumber = lastNumber + 1;
    const newOrderID = `TNC-${String(newOrderNumber).padStart(3, "0")}`;

    // Crea la orden principal
    await ordersTable.create([
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
          CreatedAt: new Date().toISOString(),
        },
      },
    ]);

    // Crea los ítems asociados (OrderItems) con OrderID como texto
    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        await orderItemsTable.create([
          {
            fields: {
              ProductName: it.name || "",
              Option: it.option || "",
              Price: Number(it.price) || 0,
              Qty: Number(it.qty) || 1,
              AddOns: Array.isArray(it.addons) ? it.addons.join(", ") : (it.addons || ""),
              OrderID: newOrderID, // vínculo por texto
            },
          },
        ]);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Order created successfully",
        orderID: newOrderID,
      }),
    };
  } catch (error) {
    console.error("orders-new error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error", details: error.message }) };
  }
};
