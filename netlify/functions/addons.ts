// netlify/functions/addons.ts
import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export const handler = async () => {
  try {
    const tableName = process.env.AIRTABLE_TABLE_ADDONS!;
    const records = await base(tableName)
      .select({ filterByFormula: "{active}=TRUE()" })
      .all();

    const addons = records.map((r) => ({
      id: r.id,
      ...r.fields,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(addons),
    };
  } catch (err: any) {
    console.error("Error fetching addons:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
