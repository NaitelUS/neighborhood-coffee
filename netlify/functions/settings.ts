import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_SETTINGS || "Settings");

    const records = await table.select().all();

    const settings = records.map((r) => ({
      id: r.id,
      opening_hour: r.fields.opening_hour || "06:00",
      closing_hour: r.fields.closing_hour || "11:00",
      closed_days: r.fields.closed_days || [],
      vacation_start: r.fields.vacation_start || null,
      vacation_end: r.fields.vacation_end || null,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(settings),
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch settings", details: error.message }),
    };
  }
};

export { handler };
