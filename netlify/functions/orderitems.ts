import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems");

    const records = await table.select().all();

    const items = records.map((r) => ({
      id: r.id,
      orderId: r.fields.orderId,
      product: r.fields.product,
      quantity: r.fields.quantity || 1,
      price: r.fields.price || 0,
      addons: r.fields.addons || [],
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (error) {
    console.error("Error fetching order items:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch order items", details: error.message }),
    };
  }
};

export { handler };
