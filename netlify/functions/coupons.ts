import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_COUPONS!)
      .select({ filterByFormula: "{active}=TRUE()" }) // Solo cupones activos
      .all();

    const coupons = records.map((record) => ({
      id: record.id,
      code: record.get("code"),
      discount: record.get("discount"),
      active: record.get("active"),
      expires_at: record.get("expires_at"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(coupons),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching coupons" }),
    };
  }
};

export { handler };
