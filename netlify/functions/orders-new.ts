import { getAirtableClient } from "../lib/airtableClient";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const base = getAirtableClient();
    const ordersTable = base("Orders");

    // Validar campos obligatorios
    const { name, phone, address, order_type, schedule_date, schedule_time, subtotal, discount, total, coupon, notes } = body;

    if (!name || !order_type || !subtotal || !total) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Generar nuevo OrderID (TNC-###)
    const records = await ordersTable
      .select({ fields: ["OrderNumber"], sort: [{ field: "OrderNumber", direction: "desc" }], maxRecords: 1 })
      .firstPage();

    const lastNumber = records.length > 0 ? records[0].fields.OrderNumber || 0 : 0;
    const newOrderNumber = Number(lastNumber) + 1;
    const newOrderID = `TNC-${String(newOrderNumber).padStart(3, "0")}`;

    // Crear la orden principal
    const createdOrder = await ordersTable.create([
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
          Status: "Received",
          Notes: notes || "",
          OrderNumber: newOrderNumber,
          OrderID: newOrderID,
          CreatedAt: new Date().toISOString(),
        },
      },
    ]);

    // 🔁 Retornar el nuevo OrderID para usarlo en orderitems-new
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order created successfully",
        orderID: newOrderID,
        recordID: createdOrder[0].id,
      }),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        details: error.message,
      }),
    };
  }
};
