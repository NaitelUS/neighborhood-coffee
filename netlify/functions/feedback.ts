import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_FEEDBACK!)
      .select()
      .all();

    const feedback = records.map((record) => ({
      id: record.id,
      rating: record.get("rating"),
      comment: record.get("comment"),
      contact: record.get("contact"),
      created_at: record.get("created_at"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(feedback),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching feedback" }),
    };
  }
};

export { handler };
