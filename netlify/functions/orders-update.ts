// netlify/functions/orders-update.ts
import { getAirtableClient } from "../lib/airtableClient";

export async function handler(event) {
  const base = getAirtableClient();

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { id, status } = JSON.parse(event.body || "{}");
    if (!id || !status) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing id or status" }) };
    }

    // Buscar registro por OrderID o RecordID
    const records = await base("Orders")
      .select({ filterByFormula: `{OrderID} = '${id}'` })
      .firstPage();

    if (records.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: "Order not found" }) };
    }

    const record = records[0];
    await base("Orders").update(record.id, { Status: status });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id, status }),
    };
  } catch (err) {
    console.error("Error in orders-update:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
