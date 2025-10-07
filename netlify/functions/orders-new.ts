import Airtable from "airtable";

export const handler = async (event: any) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body || "{}");
    console.log("🧾 Received order:", JSON.stringify(body, null, 2));

    // ✅ Validar campos mínimos
    if (!body.name || !body.phone || !body.items?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing name, phone or items",
        }),
      };
    }

    // 🧩 Verifica que las variables existan
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableOrders = process.env.AIRTABLE_TABLE_ORDERS;
    const tableOrderItems = process.env.AIRTABLE_TABLE_ORDERITEMS;

    if (!apiKey || !baseId || !tableOrders || !tableOrderItems) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: "Missing Airtable environment variables",
          details: { apiKey, baseId, tableOrders, tableOrderItems },
        }),
      };
    }

    const base = new Airtable({ apiKey }).base(baseId);

    // 🆔 Generar número de orden
    const orderNumber =
      body.orderNumber ||
      `TNC-${Date.now().toString().slice(-3)}`;

    const createdAt = new Date().toISOString();

    // 🧾 Crear la orden
    const orderResult = await base(tableOrders).create([
      {
        fields: {
          Name: body.name,
          Phone: body.phone,
          OrderType: body.order_type || "",
          Address: body.address || "",
          ScheduleDate: body.schedule_date || "",
          ScheduleTime: body.schedule_time || "",
          Subtotal: Number(body.subtotal) || 0,
          Discount: Number(body.discount) || 0,
          Total: Number(body.total) || 0,
          Coupon: body.coupon || "",
          Notes: body.notes || "",
          Status: "Received",
          OrderNumber: orderNumber,
          CreatedAt: createdAt,
        },
      },
    ]);

    const orderId = orderResult[0].id;
    console.log("✅ Order created:", orderId);

    // 🧃 Crear los productos (items)
    const itemRecords = body.items.map((item: any) => ({
      fields: {
        Order: [orderId],
        ProductName: item.product_name || item.name || "Unnamed",
        Option: item.option || "",
        AddOns:
          Array.isArray(item.addons) && item.addons.length
            ? item.addons.join(", ")
            : "",
        Price: Number(item.price) || 0,
      },
    }));

    if (itemRecords.length > 0) {
      await base(tableOrderItems).create(itemRecords);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Order created successfully",
        orderNumber,
        orderId,
      }),
    };
  } catch (error: any) {
    console.error("💥 Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Order creation failed",
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};
