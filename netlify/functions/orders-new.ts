import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS!;
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS!;

// 🧠 Generar ID corto tipo TNC-4823
function generateShortId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TNC-${random}`;
}

export const handler: Handler = async (event) => {
  try {
    const orderData = JSON.parse(event.body || "{}");
    const shortId = generateShortId();

    // 🧾 Crear la orden principal
    const createdOrder = await base(TABLE_ORDERS).create([
      {
        fields: {
          OrderID: shortId,
          Name: orderData.customer_name,
          Phone: orderData.customer_phone,
          OrderType: orderData.order_type,
          Address: orderData.address || "",
          ScheduleDate: orderData.schedule_date || "",
          ScheduleTime: orderData.schedule_time || "",
          Subtotal: orderData.subtotal,
          Discount: orderData.discount,
          Total: orderData.total,
          Coupon: orderData.coupon_code || "",
          Notes: orderData.notes || "",
          Status: "Received",
        },
      },
    ]);

    // 🧩 Crear los ítems relacionados
    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item: any) => ({
        fields: {
          Order: shortId,
          ProductName: item.name,
          Option: item.option || "",
          Price: item.price || 0,
          AddOns: Array.isArray(item.addons)
            ? item.addons
                .map((a: any) => {
                  const name = a?.name || "Unnamed";
                  const price =
                    typeof a?.price === "number" ? a.price.toFixed(2) : "0.00";
                  return `${name} ($${price})`;
                })
                .join(", ")
            : "",
        },
      }));

      while (orderItems.length > 0) {
        await base(TABLE_ORDERITEMS).create(orderItems.splice(0, 10));
      }
    }

    // ✅ Devolver ID corto
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId: shortId }),
    };
  } catch (err) {
    console.error("❌ Error creating order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create order" }),
    };
  }
};
