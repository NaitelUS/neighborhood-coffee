import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_CUSTOMERS!)
      .select()
      .all();

    const customers = records.map((record) => ({
      id: record.id,
      name: record.get("name"),
      email: record.get("email"),
      phone: record.get("phone"),
      created_at: record.get("created_at"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(customers),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching customers" }),
    };
  }
};

export { handler };
