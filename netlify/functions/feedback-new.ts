import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_FEEDBACK || "Feedback";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    const body = JSON.parse(event.body || "{}");
    const { orderId, rating, comment } = body;

    if (!orderId || !rating) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing orderId or rating" }),
      };
    }

    const record = await base(TABLE).create([
      {
        fields: {
          Order: orderId,
          Rating: Number(rating),
          Comment: comment || "",
          Created: new Date().toISOString(),
        },
      },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: record[0].id,
        ...record[0].fields,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error: any) {
    console.error("Error creating feedback:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
