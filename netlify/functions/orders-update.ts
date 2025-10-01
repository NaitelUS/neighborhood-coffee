import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { id, status } = JSON.parse(event.body || "{}");

    if (!id || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing id or status" }),
      };
    }

    const base = getAirtableClient();

    const updated = await base(TABLE_ORDERS).update([
      {
        id,
        fields: { status },
      },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order updated successfully",
        updated: updated[0].fields,
      }),
    };
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error", error: String(error) }),
    };
  }
};
