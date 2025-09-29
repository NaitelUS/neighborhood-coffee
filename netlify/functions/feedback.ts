import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_FEEDBACK!)
      .select()
      .all();

    const feedback = records.map((record) => ({
      id: record.id,
      order_id: record.get("order_id"),
      rating: record.get("rating"),
      comments: record.get("comments"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(feedback),
    };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching feedback" }),
    };
  }
};

export { handler };
