import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_ORDERS!)
      .select()
      .all();

    const orders = records.map((record) => ({
      id: record.id,
      order_number: record.get("order_number"),
      customer: record.get("customer"),
      total: record.get("total"),
      status: record.get("status"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching orders" }),
    };
  }
};

export { handler };
