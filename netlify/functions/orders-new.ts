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
    console.log("🧾 Creating order:", body);

    // Generar número legible tipo TNC-001
    const orderNumber =
      body.orderNumber || `TNC-${Date.now().toString().slice(-3)}`;
    const createdAt = new Date().toISOString();

    // 1️⃣ Crear registro principal en Orders
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
          Notes: body.notes || "",
          Status: "Received",
          OrderNumber: orderNumber,
          CreatedAt: createdAt,
        },
      },
    ]);

    const orderId = orderRecord[0].id;

    // 2️⃣ Actualizar campo OrderID con el recordId
    await base("Orders").update([
      {
        id: orderId,
        fields: { OrderID: orderId },
      },
    ]);

    // 3️⃣ Crear los OrderItems
    if (body.items && body.items.length > 0) {
      const itemsToCreate = body.items.map((item: any) => ({
        fields: {
          OrderNumber: orderNumber,
          ProductName: item.product_name || item.name || "Unnamed Item",
          Option: item.option || "",
          AddOns:
            Array.isArray(item.addons) && item.addons.length > 0
              ? item.addons.join(", ")
              : "",
          Price: Number(item.price) || 0,
        },
      }));

      await base("OrderItems").create(itemsToCreate);
      console.log(`🧩 Created ${itemsToCreate.length} items`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "✅ Order created successfully",
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
        message: "💥 Order creation failed",
        error: error.message,
      }),
    };
  }
};
