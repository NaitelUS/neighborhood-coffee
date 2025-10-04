import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_ORDERS || "Orders");

    const records = await table
      .select({
        sort: [{ field: "CreatedTime", direction: "desc" }],
      })
      .all();

    const orders = records.map((record) => ({
      id: record.id,
      name: record.fields.Name || "",
      phone: record.fields.Phone || "",
      order_type: record.fields.OrderType || "Pickup",
      total: record.fields.Total || 0,
      status: record.fields.Status || "Received",
      schedule_time: record.fields.ScheduleTime || "",
      created_at: record.fields.CreatedTime || "",
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch orders" }),
    };
  }
};

export { handler };
