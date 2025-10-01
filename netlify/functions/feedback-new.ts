import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async (event) => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_FEEDBACK || "Feedback");

    const body = JSON.parse(event.body || "{}");

    const record = await table.create([
      {
        fields: {
          rating: body.rating,
          comment: body.comment,
          orderId: body.orderId,
        },
      },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: record[0].id }),
    };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create feedback", details: error.message }),
    };
  }
};

export { handler };
