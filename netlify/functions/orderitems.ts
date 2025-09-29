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
      qty: record.get("qty"),                 // Airtable: qty
      unit_price: record.get("unit_price"),   // Airtable: unit_price
      options: record.get("options"),
      add_ons: record.get("add_ons"),         // Airtable: add_ons
      order_ref: record.get("order_ref"),     // Airtable: order_ref
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
