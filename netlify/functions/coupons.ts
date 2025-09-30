import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const TABLE = process.env.AIRTABLE_TABLE_COUPONS || "Coupons";

export const handler: Handler = async () => {
  try {
    const records = await base(TABLE).select({ view: "Grid view" }).all();

    const coupons = records
      .map((r) => {
        const code = r.get("code");
        const percent = r.get("percent_off"); // asegúrate de renombrar el campo en Airtable
        const active = !!r.get("active"); // convertir 1/0 o true/false a boolean
        const validFrom = r.get("valid_from");
        const validUntil = r.get("valid_until");

        const now = new Date();
        const isWithinRange =
          (!validFrom || new Date(validFrom) <= now) &&
          (!validUntil || new Date(validUntil) >= now);

        return {
          id: r.id,
          Code: typeof code === "string" ? code.toUpperCase().trim() : null,
          Discount:
            typeof percent === "number"
              ? percent
              : typeof percent === "string"
              ? parseFloat(percent) / 100
              : 0,
          Active: active && isWithinRange,
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
