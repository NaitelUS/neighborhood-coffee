import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS!;
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS!;

export const handler: Handler = async (event) => {
  try {
    const orderData = JSON.parse(event.body || "{}");

    // 🧾 Crear la orden principal
    const order = await base(TABLE_ORDERS).create([
      {
        fields: {
          Name: orderData.name,
          Phone: orderData.phone,
          OrderType: orderData.orderType,
          Address: orderData.address || "",
          ScheduleDate: orderData.scheduleDate,
          ScheduleTime: orderData.scheduleTime,
          ScheduleTimeDisplay: orderData.scheduleTimeDisplay,
          Subtotal: orderData.subtotal,
          Discount: orderData.discount,
          Total: orderData.total,
          Coupon: orderData.coupon || "",
          Status: "Received",
        },
      },
    ]);

    const orderId = order[0].id;

    // 🧱 Crear los OrderItems con AddOns incluidos
    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      await base(TABLE_ORDERITEMS).create(
        orderData.items.map((item) => ({
          fields: {
            Order: [orderId],
            ProductName: item.name,
            Option: item.option || "",
            Price: item.price || 0,
            AddOns: item.addons || "", // ✅ Guarda los AddOns en texto plano
          },
        }))
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: orderId }),
    };
  } catch (err) {
    console.error("❌ Error creating order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create order" }),
    };
  }
};
