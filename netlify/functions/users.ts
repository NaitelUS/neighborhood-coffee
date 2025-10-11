import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_USERS || "Users");

    const records = await table.select().all();

    const users = records.map((r) => ({
      id: r.id,
      name: r.fields.name || "",
      role: r.fields.role || "User",
      email: r.fields.email || "",
      active: r.fields.active ?? true,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch users", details: error.message }),
    };
  }
};

export { handler };
