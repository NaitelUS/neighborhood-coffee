import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_MESSAGES!)
      .select()
      .all();

    const messages = records.map((record) => ({
      id: record.id,
      name: record.get("name"),
      email: record.get("email"),
      message: record.get("message"),
      created_at: record.get("created_at"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(messages),
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching messages" }),
    };
  }
};

export { handler };
