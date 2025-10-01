import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_ADDONS || "Addons");

    const records = await table.select().all();

    const addons = records.map((r) => ({
      id: r.id,
      name: r.fields.name,
      price: r.fields.price,
      active: r.fields.active,
    }));

    return { statusCode: 200, body: JSON.stringify(addons) };
  } catch (err) {
    console.error("Error loading addons:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export { handler };
