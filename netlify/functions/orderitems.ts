import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_ORDERITEMS!)
      .select()
      .all();

    const items = records.map((record) => ({
      id: record.id,
      order: record.get("order"),
      product: record.get("product"),
      quantity: record.get("quantity"),
      addons: record.get("addons"),
      options: record.get("options"),
      price: record.get("price"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (error) {
    console.error("Error fetching order items:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching order items" }),
    };
  }
};

export { handler };
