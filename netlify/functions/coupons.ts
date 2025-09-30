import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const TABLE = process.env.AIRTABLE_TABLE_COUPONS || "Coupons";

export const handler: Handler = async () => {
  try {
    const records = await base(TABLE).select({ view: "Grid view" }).all();

    const coupons = records
      .map((r) => {
        const code = r.get("code");
        const percent = r.get("% percent_off"); // Airtable envía el valor decimal (0.1 para 10%)
        const active = r.get("active"); // Fórmula booleana en Airtable
        const validFrom = r.get("valid_from");
        const validUntil = r.get("valid_until");

        // Validar fechas activas
        const now = new Date();
        const isWithinRange =
          (!validFrom || new Date(validFrom) <= now) &&
          (!validUntil || new Date(validUntil) >= now);

        // Usar el valor tal cual, ya es decimal
        const discountValue =
          typeof percent === "number"
            ? percent
            : 0;

        return {
          id: r.id,
          Code: typeof code === "string" ? code.toUpperCase().trim() : null,
          Discount: discountValue,
          Active: !!active && isWithinRange && discountValue > 0,
        };
      })
      .filter((c) => c.Active && c.Code);

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
