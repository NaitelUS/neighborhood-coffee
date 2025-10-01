import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async (event) => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_ORDERS || "Orders");

    const body = JSON.parse(event.body || "{}");

    const record = await table.create([
      {
        fields: {
          customer: body.customer,
          total: body.total,
          status: body.status || "Received",
          createdAt: new Date().toISOString(),
        },
      },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: record[0].id }),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create order",
        details: error.message,
      }),
    };
  }
};

export { handler };
