import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_USERS!)
      .select()
      .all();

    const users = records.map((record) => ({
      id: record.id,
      name: record.get("name"),
      email: record.get("email"),
      role: record.get("role"),
      active: record.get("active"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching users" }),
    };
  }
};

export { handler };
