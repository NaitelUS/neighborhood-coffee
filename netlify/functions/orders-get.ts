import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

export const handler: Handler = async (event) => {
  try {
    const { id } = event.queryStringParameters || {};

    const records = await base(TABLE_ORDERS)
      .select({
        sort: [{ field: "CreatedTime", direction: "desc" }],
      })
      .all();

    const orders = records.map((record) => ({
      id: record.fields.OrderID || record.id,
      order_number: record.fields.OrderNumber || null,
      name: record.fields.Name || "",
      phone: record.fields.Phone || "",
      order_type: record.fields.OrderType || "Pickup",
      total: record.fields.Total || 0,
      discount: record.fields.Discount || 0,
      coupon: record.fields.Coupon || "",
      status: record.fields.Status || "Received",
      schedule_date: record.fields.ScheduleDate || "",
      schedule_time: record.fields.ScheduleTime || "",
      address: record.fields.Address || "",
      notes: record.fields.Notes || "",
      created_at: record.fields.CreatedTime || "",
    }));

    // Si viene ID → devolver solo esa orden
    if (id) {
      const found = orders.find((o) => o.id === id);
      return {
        statusCode: 200,
        body: JSON.stringify(found || null),
      };
    }

    // Si no hay ID → devolver todas
    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch orders" }),
    };
  }
};
