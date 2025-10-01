import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_PRODUCT_OPTIONS || "ProductOptions");

    const records = await table.select().all();

    const options = records.map((r) => ({
      id: r.id,
      name: r.fields.name || "",
      price: r.fields.price || 0,
      type: r.fields.type || "addon",
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(options),
    };
  } catch (error) {
    console.error("Error fetching product options:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch product options", details: error.message }),
    };
  }
};

export { handler };
