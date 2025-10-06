import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS!;
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS!;

export const handler: Handler = async () => {
  try {
    // 🧾 Obtener órdenes principales
    const ordersRecords = await base(TABLE_ORDERS)
      .select({ sort: [{ field: "CreatedTime", direction: "desc" }] })
      .all();

    // 🧱 Obtener los OrderItems
    const itemsRecords = await base(TABLE_ORDERITEMS)
      .select({ sort: [{ field: "CreatedTime", direction: "asc" }] })
      .all();

    const itemsByOrder: Record<string, any[]> = {};
    itemsRecords.forEach((r) => {
      const orderIds = r.fields["Order"];
      if (Array.isArray(orderIds)) {
        orderIds.forEach((oid) => {
          if (!itemsByOrder[oid]) itemsByOrder[oid] = [];
          itemsByOrder[oid].push({
            id: r.id,
            ProductName: r.fields["ProductName"] || "",
            Option: r.fields["Option"] || "",
            AddOns: r.fields["AddOns"] || "",
            Price: r.fields["Price"] || 0,
          });
        });
      }
    });

    // 🧩 Combinar órdenes con sus items
    const formatted = ordersRecords.map((r) => ({
      id: r.id,
      name: r.fields["Name"] || "",
      phone: r.fields["Phone"] || "",
      address: r.fields["Address"] || "",
      order_type: r.fields["OrderType"] || "",
      schedule_date: r.fields["ScheduleDate"] || "",
      schedule_time:
        r.fields["ScheduleTimeDisplay"] || r.fields["ScheduleTime"] || "",
      subtotal: r.fields["Subtotal"] || 0,
      discount: r.fields["Discount"] || 0,
      total: r.fields["Total"] || 0,
      coupon_code: r.fields["Coupon"] || "",
      status: r.fields["Status"] || "Received",
      created_at: r.fields["CreatedTime"] || "",
      items: itemsByOrder[r.id] || [],
    }));

    return { statusCode: 200, body: JSON.stringify(formatted) };
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch orders" }),
    };
  }
};
