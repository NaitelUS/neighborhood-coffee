// netlify/functions/coupons-check.ts
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

export default async (req: Request) => {
  try {
    const { code } = await req.json();

    if (!code) {
      return new Response(JSON.stringify({ error: "Missing code" }), { status: 400 });
    }

    const records = await base(process.env.AIRTABLE_TABLE_COUPONS!)
      .select({
        filterByFormula: `AND({Code}='${code}', {Active}=TRUE())`,
      })
      .all();

    if (records.length === 0) {
      return new Response(JSON.stringify({ valid: false }), { status: 200 });
    }

    const record = records[0];
    const discount = record.get("Discount") || 0;

    return new Response(JSON.stringify({ valid: true, discount }), { status: 200 });
  } catch (err) {
    console.error("Coupon check error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
