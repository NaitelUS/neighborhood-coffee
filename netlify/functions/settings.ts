import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_SETTINGS!)
      .select()
      .all();

    const settings = records.map((record) => ({
      id: record.id,
      key: record.get("key"),
      value: record.get("value"),
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
