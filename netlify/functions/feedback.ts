import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async (event) => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_FEEDBACK || "Feedback");

    const records = await table.select().all();

    const feedback = records.map((r) => ({
      id: r.id,
      rating: r.fields.rating || 0,
      comment: r.fields.comment || "",
      orderId: r.fields.orderId || "",
      createdAt: r.fields.createdAt || null,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(feedback),
    };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch feedback", details: error.message }),
    };
  }
};

export { handler };
