import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_ORDERITEMS!)
      .select()
      .all();

    const orderItems = records.map((record) => ({
      id: record.id,
      order: record.get("order"),
      product: record.get("product"),
      quantity: record.get("qty"),
      addons: record.get("add_ons"),
      options: record.get("options"),
      price: record.get("unit_price"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(orderItems),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching order items" }),
    };
  }
};

export { handler };
