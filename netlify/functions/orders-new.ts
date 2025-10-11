import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = "Orders";
const TABLE_ORDERITEMS = "OrderItems";

// 🔢 Obtiene el siguiente número consecutivo
async function getNextOrderNumber() {
  try {
    const records = await base(TABLE_ORDERS)
      .select({
        sort: [{ field: "OrderNumber", direction: "desc" }],
        maxRecords: 1,
      })
      .firstPage();

    if (records.length > 0) {
      const last = records[0].fields["OrderNumber"];
      if (typeof last === "number") return last + 1;
    }
    return 1;
  } catch (err) {
    console.error("⚠️ Error fetching last order number:", err);
    return 1;
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const orderData = JSON.parse(event.body || "{}");
    console.log("🧾 Incoming order:", orderData);

    // Generar número incremental y formato de ID corto
    const nextNumber = await getNextOrderNumber();
    const orderId = `TNC-${String(nextNumber).padStart(3, "0")}`;

    // 🧱 Crear registro principal (Orders)
    const [orderRecord] = await base(TABLE_ORDERS).create([
      {
        fields: {
          OrderID: orderId,
          OrderNumber: nextNumber,
          Name: orderData.customer_name || "",
          Phone: orderData.customer_phone || "",
          Address: orderData.address || "",
          OrderType: orderData.order_type || "",
          ScheduleDate: orderData.schedule_date || "",
          ScheduleTime: orderData.schedule_time || "",
          Subtotal: orderData.subtotal || 0,
          Discount: orderData.discount || 0,
          Total: orderData.total || 0,
          Coupon: orderData.coupon_code || "",
          Notes: orderData.notes || "",
          Status: "Received",
          CreatedAt: new Date().toISOString(),
        },
      },
    ]);

    console.log(`✅ Order created: ${orderId}`);

    // 📦 Crear ítems asociados
    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item: any) => ({
        fields: {
          Order: orderId,
          ProductName: item.name,
          Option: item.option || "",
          Price: item.price || 0,
          AddOns: Array.isArray(item.addons)
            ? item.addons.map((a: any) => a.name || "").join(", ")
            : "",
          Qty: item.qty || 1,
        },
      }));

      while (orderItems.length > 0) {
        const batch = orderItems.splice(0, 10);
        await base(TABLE_ORDERITEMS).create(batch);
      }

      console.log("✅ OrderItems saved successfully");
    }

    // 🔁 Respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId }),
    };
  } catch (err) {
    console.error("❌ Error creating order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to create order" }),
    };
  }
};
