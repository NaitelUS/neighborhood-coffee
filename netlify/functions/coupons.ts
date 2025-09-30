import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

export const handler: Handler = async () => {
  try {
    const records = await base("Coupons")
      .select({
        fields: ["code", "percent_off", "active"],
        filterByFormula: "active = 1",
      })
      .all();

    const coupons = records.map((r) => ({
      id: r.id,
      Code: r.get("code"),
      Discount:
        typeof r.get("percent_off") === "number"
          ? r.get("percent_off")
          : parseFloat(String(r.get("percent_off")).replace("%", "")) / 100,
      Active: r.get("active") === true || r.get("active") === 1,
    }));

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
