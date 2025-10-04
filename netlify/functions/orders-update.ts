import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: "Missing body" };
    }

    const { id, status } = JSON.parse(event.body);
    if (!id || !status) {
      return { statusCode: 400, body: "Missing id or status" };
    }

    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_ORDERS || "Orders");

    const updated = await table.update([
      { id, fields: { Status: status } },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, record: updated[0] }),
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update order" }),
    };
  }
};

export { handler };
