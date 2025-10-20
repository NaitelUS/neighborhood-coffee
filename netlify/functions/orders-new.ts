import { getAirtableClient } from "../lib/airtableClient";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
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

    // Validación mínima
    if (!name || !order_type || !subtotal || !total) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields",
          received: body,
        }),
      };
    }

    const base = getAirtableClient();
    const ordersTable = base("Orders");
    const orderItemsTable = base("OrderItems");

    // Obtener el número de orden actual
    const allOrders = await ordersTable.select({}).all();
    const orderNumber = allOrders.length + 1;
    const orderID = `TNC-${String(orderNumber).padStart(3, "0")}`;

    // Crear la orden principal
    const createdOrder = await ordersTable.create([
      {
        fields: {
          Name: name,
          Phone: phone,
          Address: address,
          OrderType: order_type,
          ScheduleDate: schedule_date,
          ScheduleTime: schedule_time,
          Subtotal: subtotal,
          Discount: discount,
          Total: total,
          Coupon: coupon,
          Notes: notes,
          Status: "Received",
          OrderID: orderID,
          OrderNumber: orderNumber,
        },
      },
    ]);

    // Crear los productos relacionados si hay items
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await orderItemsTable.create([
          {
            fields: {
              ProductName: item.name,
              Option: item.option,
              Price: item.price,
              Qty: item.qty || 1,
              AddOns: item.addons || "",
              OrderID: orderID,
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
        orderID,
      }),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};
