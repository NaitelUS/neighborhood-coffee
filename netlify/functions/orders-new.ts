import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS!;
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS!;

// 🧠 Genera consecutivo real
async function getNextOrderNumber() {
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
}

export const handler: Handler = async (event) => {
  try {
    const orderData = JSON.parse(event.body || "{}");
    const nextNumber = await getNextOrderNumber();
    const shortId = `TNC-${String(nextNumber).padStart(3, "0")}`;

    const createdOrder = await base(TABLE_ORDERS).create([
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
          Subtotal: orderData.subtotal,
          Discount: orderData.discount,
          Total: orderData.total,
          Coupon: orderData.coupon_code || "",
          Notes: orderData.notes || "",
          Status: "Received",
        },
      },
    ]);

    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item: any) => ({
        fields: {
          Order: shortId,
          ProductName: item.name,
          Option: item.option || "",
          Price: item.price || 0,
          AddOns: Array.isArray(item.addons)
            ? item.addons
                .map(
                  (a: any) =>
                    `${a?.name || "Unnamed"} ($${(a?.price || 0).toFixed(2)})`
                )
                .join(", ")
            : "",
        },
      }));

      while (orderItems.length > 0) {
        await base(TABLE_ORDERITEMS).create(orderItems.splice(0, 10));
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId: shortId }),
    };
  } catch (err) {
    console.error("Error creating order:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed" }) };
  }
};
