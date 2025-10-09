import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

// 🧮 Obtener siguiente número de orden
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
      if (typeof last === "string" && /^\d+$/.test(last)) return Number(last) + 1;
    }
    return 1;
  } catch (err) {
    console.error("⚠️ Error fetching last order number:", err);
    return 1;
  }
}

export const handler: Handler = async (event) => {
  try {
    const orderData = JSON.parse(event.body || "{}");
    console.log("🧾 Incoming order:", orderData);

    const nextNumber = await getNextOrderNumber();
    const shortId = `TNC-${String(nextNumber).padStart(3, "0")}`;

    const subtotal = Number(orderData.subtotal) || 0;
    const discount = Number(orderData.discount) || 0;
    const total = Number(orderData.total) || subtotal - subtotal * discount;

    // 🟢 Crear orden principal
    await base(TABLE_ORDERS).create([
      {
        fields: {
          OrderID: shortId,
          OrderNumber: nextNumber,
          Name: orderData.customer_name,
          Phone: orderData.customer_phone,
          OrderType: orderData.order_type,
          Address: orderData.address || "",
          ScheduleDate: orderData.schedule_date || "",
          ScheduleTime: orderData.schedule_time || "",
          Subtotal: subtotal,
          Discount: discount, // porcentaje decimal (ej: 0.15)
          Total: total,
          Coupon: orderData.coupon_code || "",
          Notes: orderData.notes || "",
          Status: "Received",
          CreatedAt: new Date().toISOString(),
        },
      },
    ]);

    console.log(`✅ Order created: ${shortId}`);

    // 🟨 Crear los items
    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item: any) => ({
        fields: {
          OrderNumber: shortId, // usamos el ID tipo TNC-###
          ProductName: item?.name || "",
          Option: item?.option || "",
          AddOns: Array.isArray(item?.addons)
            ? item.addons
                .map(
                  (a: any) =>
                    `${a?.name || "Unnamed"} ($${(a?.price || 0).toFixed(2)})`
                )
                .join(", ")
            : "",
          Price: Number(item?.price) || 0,
          Qty: Number(item?.qty) || 1,
        },
      }));

      while (orderItems.length > 0) {
        const batch = orderItems.splice(0, 10);
        await base(TABLE_ORDERITEMS).create(batch);
      }

      console.log("✅ OrderItems saved successfully");
    } else {
      console.warn("⚠️ No order items found in request");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId: shortId }),
    };
  } catch (err) {
    console.error("❌ Error creating order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to create order" }),
    };
  }
};
