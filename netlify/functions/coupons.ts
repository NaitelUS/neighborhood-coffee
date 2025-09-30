import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_COUPONS || "Coupons";

export const handler: Handler = async () => {
  try {
    const records = await base(TABLE)
      .select({
        view: "Grid view",
        filterByFormula: `
          AND(
            {Active},
            OR({ValidFrom} = BLANK(), IS_BEFORE({ValidFrom}, TODAY())),
            OR({ValidUntil} = BLANK(), IS_AFTER({ValidUntil}, TODAY()))
          )
        `,
      })
      .all();

    const coupons = records.map((rec) => ({
      id: rec.id,
      code: rec.get("Code"),
      type: rec.get("Type"),
      value: rec.get("Value"),
      description: rec.get("Description"),
      validFrom: rec.get("ValidFrom"),
      validUntil: rec.get("ValidUntil"),
      active: rec.get("Active"),
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(coupons),
    };
  } catch (err: any) {
    console.error("Error fetching coupons:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
