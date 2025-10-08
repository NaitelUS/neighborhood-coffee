import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_ORDERS || "Orders");

    const records = await table.select().all();

    const orders = records.map((r) => ({
      id: r.id,
      customer: r.fields.customer,
      total: r.fields.total,
      status: r.fields.status,
      createdAt: r.fields.createdAt,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch orders", details: error.message }),
    };
  }
};

export { handler };
