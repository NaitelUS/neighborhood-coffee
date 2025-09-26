import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_PRODUCTS as string)
      .select({ maxRecords: 10 })
      .all();

    const products = records.map((r) => ({
      id: r.id,
      ...r.fields,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};

export { handler };
