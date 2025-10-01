import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_ADDONS || "Addons");

    const records = await table.select().all();

    const addons = records.map((record) => ({
      id: record.id,
      name: record.fields.name || "",
      price: Number(record.fields.price) || 0,
      active: record.fields.active ?? true,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(addons),
    };
  } catch (error) {
    console.error("Error fetching addons:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch addons", details: error.message }),
    };
  }
};

export { handler };
