import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async (event) => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_ORDERS || "Orders");

    const body = JSON.parse(event.body || "{}");
    const { id, status } = body;

    if (!id || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing id or status" }),
      };
    }

    await table.update([{ id, fields: { status } }]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Order updated successfully" }),
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to update order",
        details: error.message,
      }),
    };
  }
};

export { handler };
