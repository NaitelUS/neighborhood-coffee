import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);
const TABLE = process.env.AIRTABLE_TABLE_COUPONS || "Coupons";

export async function handler(event) {
  const { code } = JSON.parse(event.body || "{}");

  if (!code) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing coupon code" }) };
  }

  try {
    const records = await base(TABLE)
      .select({ filterByFormula: `AND({Code}='${code}', {Active}=TRUE())` })
      .all();

    if (records.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ valid: false }) };
    }

    const record = records[0];
    const discount = record.get("Discount") || 0;
    return { statusCode: 200, body: JSON.stringify({ valid: true, discount }) };
  } catch (err) {
    console.error("Error checking coupon:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
}
