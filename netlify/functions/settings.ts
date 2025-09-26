import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_SETTINGS!)
      .select()
      .all();

    const settings = records.map((record) => ({
      id: record.id,
      day: record.get("day"),
      open_time: record.get("open_time"),
      close_time: record.get("close_time"),
      closed: record.get("closed"),
      banner: record.get("banner"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(settings),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching settings" }),
    };
  }
};

export { handler };
