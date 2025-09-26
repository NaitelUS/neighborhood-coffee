import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_USERS!)
      .select()
      .all();

    const users = records.map((record) => ({
      id: record.id,
      name: record.get("name"),
      role: record.get("role"), // admin, barista, etc.
      email: record.get("email"),
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
