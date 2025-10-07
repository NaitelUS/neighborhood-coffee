import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

export const handler = async (event: any) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ success: false, message: "Method Not Allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    console.log("🧾 Received order:", JSON.stringify(body, null, 2));

    // --- ✅ Validación de campos esenciales
    if (!body.name || !body.phone || !body.items || body.items.length === 0) {
      console.error("❌ Missing required fields");
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Missing required fields: name, phone or items",
        }),
      };
    }

    // --- 🆔 Generar número de orden TNC-###
    const timestamp = Date.now();
    const orderNumber = body.orderNumber || `TNC-${timestamp.toString().slice(-3)}`;

    // --- 🕒 Fecha ISO
    const createdAt = new Date().toISOString();

    // --- 🧾 Crear registro en Airtable
    const orderRecord = await base(process.env.AIRTABLE_TABLE_ORDERS!).create([
      {
        fields: {
          Name: body.name,
          Phone: body.phone,
          OrderType: body.order_type || "",
          Address: body.address || "",
          ScheduleDate: body.schedule_date || "",
          ScheduleTime: body.schedule_time || "",
          Subtotal: body.subtotal || 0,
          Discount: body.discount || 0,
          Total: body.total || 0,
          Coupon: body.coupon || "",
          Notes: body.notes || "",
          Status: "Received",
          OrderNumber: orderNumber,
          CreatedAt: createdAt,
        },
      },
    ]);

    console.log("✅ Order created:", orderRecord[0].id);

    // --- Crear items relacionados
    if (body.items && Array.isArray(body.items)) {
      const orderId = orderRecord[0].id;

      const itemRecords = body.items.map((item: any) => ({
        fields: {
          Order: [orderId],
          ProductName: item.product_name || item.name || "Unnamed Product",
          Option: item.option || "",
          AddOns:
            Array.isArray(item.addons) && item.addons.length > 0
              ? item.addons.join(", ")
              : "",
          Price: Number(item.price) || 0,
        },
      }));

      await base(process.env.AIRTABLE_TABLE_ORDERITEMS!).create(itemRecords);
      console.log("🧃 Items created:", itemRecords.length);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Order created successfully",
        orderNumber: orderNumber,
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
