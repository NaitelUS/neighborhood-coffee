import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_COUPONS || "Coupons");

    const records = await table.select().all();

    // ✅ Mapeo seguro de campos
    const coupons = records.map((record) => {
      const fields = record.fields;

      return {
        id: record.id,
        code: fields.code || "",
        percent_off:
          typeof fields.percent_off === "number"
            ? fields.percent_off
            : parseFloat(fields.percent_off) / 100 || 0,
        valid_from: fields.valid_from || null,
        valid_until: fields.valid_until || null,
        active: fields.active ?? false,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(coupons),
    };
  } catch (error) {
    console.error("Error loading coupons:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch coupons",
        details: error.message,
      }),
    };
  }
};

export { handler };
