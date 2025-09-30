import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const TABLE = process.env.AIRTABLE_TABLE_COUPONS || "Coupons";

export const handler: Handler = async () => {
  try {
    const records = await base(TABLE).select({ view: "Grid view" }).all();

    const coupons = records
      .map((r) => {
        const code = r.get("code");
        const percent = r.get("percent_off");
        const active = !!r.get("active"); // Airtable ya decide esto con tu fórmula

        return {
          id: r.id,
          Code: typeof code === "string" ? code.toUpperCase().trim() : null,
          Discount:
            typeof percent === "number"
              ? percent
              : typeof percent === "string"
              ? parseFloat(percent.replace("%", "")) / 100
              : 0,
          Active: active,
        };
      })
      .filter((c) => c.Active && c.Code && c.Discount > 0);

    return {
      statusCode: 200,
      body: JSON.stringify(coupons),
    };
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch coupons" }),
    };
  }
};
