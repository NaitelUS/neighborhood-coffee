import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

export const handler: Handler = async (event) => {
  try {
    const { code } = JSON.parse(event.body || "{}");
    if (!code) return { statusCode: 400, body: JSON.stringify({ success: false, message: "Missing code" }) };

    const records = await base("Coupons")
      .select({ filterByFormula: `{Code} = '${code}'` })
      .firstPage();

    if (records.length === 0)
      return { statusCode: 404, body: JSON.stringify({ success: false, message: "Invalid coupon" }) };

    const coupon = records[0].fields;
    const percent_off = Number(coupon.percent_off || 0);
    const amount_off = Number(coupon.amount_off || 0);
    const discount = amount_off > 0 ? amount_off : percent_off;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        discount,
        type: amount_off > 0 ? "amount" : "percent",
      }),
    };
  } catch (err: any) {
    console.error("Coupon check failed:", err);
    return { statusCode: 500, body: JSON.stringify({ success: false, message: "Server error" }) };
  }
};
