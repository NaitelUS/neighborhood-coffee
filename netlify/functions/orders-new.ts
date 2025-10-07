import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    console.log("Creating order with body:", body);

    // Generar número TNC si no viene
    const orderNumber = body.orderNumber || `TNC-${Date.now().toString().slice(-3)}`;

    // Crear registro en Orders
    const orderRecord = await base("Orders").create([
      {
        fields: {
          Name: body.name,
          Phone: body.phone,
          OrderType: body.order_type,
          Address: body.address || "",
          ScheduleDate: body.schedule_date || "",
          ScheduleTime: body.schedule_time || "",
          Subtotal: body.subtotal,
          Discount: body.discount,
          Total: body.total,
          Coupon: body.coupon || "",
          Status: "Received",
          Notes: body.notes || "",
          OrderNumber: orderNumber,
        },
      },
    ]);

    console.log("✅ Order created:", orderRecord[0].id);

    const orderId = orderRecord[0].id;

    // Crear registros en OrderItems
    if (body.items && body.items.length > 0) {
      const itemRecords = body.items.map((item: any) => ({
        fields: {
          Order: [orderId],
          ProductName: item.product_name || item.name,
          Option: item.option || "",
          AddOns:
            item.addons && item.addons.length > 0
              ? item.addons.join(", ")
              : "",
          Price: item.price,
        },
      }));

      await base("OrderItems").create(itemRecords);
      console.log(`🧃 Created ${itemRecords.length} items`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Order created successfully",
        orderNumber,
      }),
    };
  } catch (error: any) {
    console.error("❌ Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Order creation failed",
        error: error.message,
      }),
    };
  }
};
