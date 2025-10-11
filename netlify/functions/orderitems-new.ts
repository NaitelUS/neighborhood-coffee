import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    const body = JSON.parse(event.body || "{}");
    const { orderId, items } = body;

    if (!orderId || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing orderId or items array.",
        }),
      };
    }

    // Limitar a 10 ítems por batch para Airtable API
    const batches = [];
    for (let i = 0; i < items.length; i += 10) {
      batches.push(items.slice(i, i + 10));
    }

    const results: any[] = [];

    for (const batch of batches) {
      const created = await base(TABLE).create(
        batch.map((item) => ({
          fields: {
            Order: [orderId],
            ProductName: item.name,
            Quantity: Number(item.qty || 1),
            UnitPrice: Number(item.price || 0),
            AddOns: (item.addons || []).join(", "),
            Option: item.option || "",
            Subtotal: Number(item.subtotal || item.price || 0),
          },
        }))
      );
      results.push(...created.map((r) => ({ id: r.id, ...r.fields })));
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ created: results }),
    };
  } catch (err: any) {
    console.error("Error creating order items:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
