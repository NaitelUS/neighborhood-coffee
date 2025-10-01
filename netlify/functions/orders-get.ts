import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

export const handler: Handler = async () => {
  try {
    const base = getAirtableClient();

    const records = await base(TABLE_ORDERS)
      .select({ sort: [{ field: "created_at", direction: "desc" }] })
      .all();

    const orders = records.map((r) => ({
      id: r.id,
      ...r.fields,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error", error: String(error) }),
    };
  }
};
