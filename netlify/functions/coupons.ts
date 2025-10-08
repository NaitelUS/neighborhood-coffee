import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_COUPONS = process.env.AIRTABLE_TABLE_COUPONS || "Coupons";

export const handler: Handler = async () => {
  try {
    const records = await base(TABLE_COUPONS)
      .select({
        view: "Grid view",
        fields: ["code", "percent_off", "active", "valid_from", "valid_until"],
      })
      .all();

    const coupons = records.map((r) => ({
      code: r.fields.code,
      percent_off: r.fields.percent_off,
      active: r.fields.active,
      valid_from: r.fields.valid_from,
      valid_until: r.fields.valid_until,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(coupons),
    };
  } catch (err) {
    console.error("Error fetching coupons:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message:
          "⚠️ Unable to verify coupon right now. Please try again later.",
      }),
    };
  }
};
