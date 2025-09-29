import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_ADDONS!)
      .select({ filterByFormula: "{active}=TRUE()" })
      .all();

    const addons = records.map((record) => ({
      id: record.id,
      name: record.get("name"),
      extra_price: record.get("extra_price"),
      active: record.get("active"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(addons),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching addons" }),
    };
  }
};

export { handler };
