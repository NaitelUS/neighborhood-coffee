import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

export const handler: Handler = async (event) => {
  try {
    const { id } = event.queryStringParameters || {};

    if (id) {
      // 🧩 Obtener orden específica por ID
      const record = await base(TABLE).find(id);
      return {
        statusCode: 200,
        body: JSON.stringify({
          id: record.id,
          ...record.fields,
        }),
        headers: { "Content-Type": "application/json" },
      };
    } else {
      // 📋 Listar todas las órdenes
      const records = await base(TABLE)
        .select({ sort: [{ field: "Created", direction: "desc" }] })
        .all();

      const data = records.map((r) => ({
        id: r.id,
        ...r.fields,
      }));

      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      };
    }
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
