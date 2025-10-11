import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_COUPONS = "Coupons";

export const handler: Handler = async (event) => {
  try {
    const code = (event.queryStringParameters?.code || "").trim();
    if (!code) {
      return { statusCode: 200, body: JSON.stringify({ valid: false, reason: "Missing code" }) };
    }

    const records = await base(TABLE_COUPONS)
      .select({
        filterByFormula: `LOWER({code}) = '${code.toLowerCase()}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ valid: false, reason: "Coupon not found" }) };
    }

    const c = records[0].fields as any;
    const active = !!c.active;
    const pct = Number(c.percent_off || 0) / 100;

    // Validación de fechas (si existen)
    const now = new Date();
    const fromOk = !c.valid_from || new Date(c.valid_from) <= now;
    const untilOk = !c.valid_until || new Date(c.valid_until) >= now;

    if (!active || !fromOk || !untilOk || !(pct > 0)) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          valid: false,
          reason: !active ? "Inactive" : !fromOk ? "Not started" : !untilOk ? "Expired" : "Invalid discount",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        valid: true,
        code: c.code,
        discount: pct, // 0.15 = 15%
      }),
    };
  } catch (err) {
    console.error("coupons.ts error:", err);
    // Responder 200 para no romper UI
    return { statusCode: 200, body: JSON.stringify({ valid: false, reason: "Server error" }) };
    // Si prefieres 500, cambia el statusCode a 500 y ajusta el front.
  }
};
