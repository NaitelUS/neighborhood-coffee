import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);
const TABLE = process.env.AIRTABLE_TABLE_PRODUCTS || "Products";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { id, fields } = JSON.parse(event.body || "{}");

    if (!id || !fields) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing id or fields" }),
      };
    }

    const updated = await base(TABLE).update([{ id, fields }]);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, record: updated[0] }),
    };
  } catch (err: any) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
