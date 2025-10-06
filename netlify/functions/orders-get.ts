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
      .select({ sort: [{ field: "CreatedTime", direction: "desc" }] })
      .all();

    const orders = records.map((record) => ({
      id: record.fields.OrderID || record.id,
      name: record.fields.Name || "",
      phone: record.fields.Phone || "",
      order_type: record.fields.OrderType || "Pickup",
      total: record.fields.Total || 0,
      status: record.fields.Status || "Received",
      schedule_date: record.fields.ScheduleDate || "",
      schedule_time: record.fields.ScheduleTime || "",
      notes: record.fields.Notes || "",
      created_at: record.fields.CreatedTime || "",
      address: record.fields.Address || "",
    }));

    if (id) {
      const found = orders.find((o) => o.id === id);
      return {
        statusCode: 200,
        body: JSON.stringify(found || null),
      };
    }

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
