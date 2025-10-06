import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { id, status } = body;

    if (!id || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing id or status" }),
      };
    }

    // Buscar el record por OrderID (TNC-001)
    const records = await base(TABLE_ORDERS)
      .select({
        filterByFormula: `{OrderID} = '${id}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Order not found" }),
      };
    }

    const recordId = records[0].id;

    await base(TABLE_ORDERS).update([
      {
        id: recordId,
        fields: { Status: status },
      },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("❌ Error updating order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update order" }),
    };
  }
};
