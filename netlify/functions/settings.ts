import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_SETTINGS!)
      .select()
      .all();

    const settings = records.map((record) => ({
      id: record.id,
      day: record.get("day"), // día de la semana
      open_time: record.get("open_time"),
      close_time: record.get("close_time"),
      closed: record.get("closed"), // boolean
      banner: record.get("banner"), // mensaje opcional
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
