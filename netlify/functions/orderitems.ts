import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  try {
    const { id } = event.queryStringParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing order ID" }),
      };
    }

    const records = await base(TABLE)
      .select({
        filterByFormula: `{Order} = '${id}'`,
      })
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
  } catch (error: any) {
    console.error("Error fetching order items:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
