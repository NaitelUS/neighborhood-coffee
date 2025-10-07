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
    console.log("🧾 Creating order with body:", body);

    // ✅ Generar número de orden si no viene del frontend
    const orderNumber =
      body.orderNumber || `TNC-${Date.now().toString().slice(-3)}`;

    // ✅ Fecha/hora exacta de creación (hora del sistema)
    const createdAt = new Date().toISOString();

    // 🧱 Crear registro principal en tabla Orders
    const orderRecord = await base("Orders").create([
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
          Status: "Received",
          Notes: body.notes || "",
          OrderNumber: orderNumber,
          CreatedAt: createdAt, // 🕒 ← campo controlado por tu sistema
        },
      },
    ]);

    console.log("✅ Order created:", orderRecord[0].id);
    const orderId = orderRecord[0].id;

    // 🧃 Crear los items asociados a la orden
    if (body.items && body.items.length > 0) {
      const itemRecords = body.items.map((item: any) => ({
        fields: {
          Order: [orderId],
          ProductName: item.product_name || item.name || "Unnamed Item",
          Option: item.option || "",
          AddOns:
            Array.isArray(item.addons) && item.addons.length > 0
              ? item.addons.join(", ")
              : "",
          Price: Number(item.price) || 0,
        },
      }));

      await base("OrderItems").create(itemRecords);
      console.log(`🧩 Created ${itemRecords.length} items for order.`);
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
    console.error("💥 Error creating order:", error);
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
