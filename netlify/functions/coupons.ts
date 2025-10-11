import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

export const handler: Handler = async (event) => {
  const code = event.queryStringParameters?.code?.trim().toUpperCase();

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ valid: false, reason: "Missing coupon code" }),
    };
  }

  try {
    const records = await base("Coupons")
      .select({ filterByFormula: `{code} = "${code}"` })
      .firstPage();

    if (!records.length) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false, reason: "Coupon not found" }),
      };
    }

    const record = records[0];
    const isActive = record.get("active");
    const discountField = record.get("percent_off");

    const discount =
      typeof discountField === "number"
        ? discountField
        : parseFloat(String(discountField || "0"));

    if (!isActive || discount <= 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          valid: false,
          reason: "Inactive or invalid coupon",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        valid: true,
        code,
        discount,
      }),
    };
  } catch (err) {
    console.error("Error verifying coupon:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        valid: false,
        reason: "Server error verifying coupon",
      }),
    };
  }
};
