import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "PATCH") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    const body = JSON.parse(event.body || "{}");
    const { id, status } = body;

    if (!id || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing id or status" }),
      };
    }

    // 🧩 Actualizar estatus
    const updated = await base(TABLE).update(id, { Status: status });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: updated.id, ...updated.fields }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error: any) {
    console.error("Error updating order:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
