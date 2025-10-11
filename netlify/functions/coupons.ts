import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

exports.handler = async (event) => {
  try {
    const codeParam = event.queryStringParameters?.code;
    if (!codeParam) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing code" }) };
    }

    const code = codeParam.trim().toUpperCase();

    const records = await base("Coupons")
      .select({
        filterByFormula: `UPPER({code}) = '${code}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (!records || records.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Coupon not found" }),
      };
    }

    const coupon = records[0].fields;
    const now = new Date();

    // ✅ Validaciones
    if (!coupon.active) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Coupon inactive" }),
      };
    }

    if (
      (coupon.valid_from && new Date(coupon.valid_from) > now) ||
      (coupon.valid_until && new Date(coupon.valid_until) < now)
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Coupon expired or not yet valid" }),
      };
    }

    const percent_off = Number(coupon.percent_off || 0);
    if (percent_off <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid discount value" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        code: coupon.code,
        percent_off,
      }),
    };
  } catch (err) {
    console.error("Coupon error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error verifying coupon" }),
    };
  }
};
