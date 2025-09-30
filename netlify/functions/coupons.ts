import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_COUPONS } = process.env;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error("❌ Missing Airtable API Key or Base ID in environment variables");
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID!);
const tableName = AIRTABLE_TABLE_COUPONS || "Coupons";

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { code } = body;

    if (!code) {
      return { statusCode: 400, body: JSON.stringify({ error: "Coupon code required" }) };
    }

    const records = await base(tableName)
      .select({
        filterByFormula: `AND({Code}='${code}', {Active}=TRUE())`,
      })
      .firstPage();

    if (records.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ valid: false }) };
    }

    const record = records[0];
    const discount = record.get("Discount") || 0;

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: true, discount }),
    };
  } catch (err: any) {
    console.error("❌ Error validating coupon:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
