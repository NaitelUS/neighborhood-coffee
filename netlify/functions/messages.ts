import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_MESSAGES || "Messages");

    const records = await table.select().all();

    const messages = records.map((r) => ({
      id: r.id,
      name: r.fields.name || "",
      email: r.fields.email || "",
      message: r.fields.message || "",
      createdAt: r.fields.createdAt || null,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(messages),
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch messages", details: error.message }),
    };
  }
};

export { handler };
