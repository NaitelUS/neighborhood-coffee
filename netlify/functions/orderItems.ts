import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_ORDERITEMS!)
      .select()
      .all();

    const orderItems = records.map((record) => ({
      id: record.id,
      order: record.get("order"), // referencia a Orders
      product: record.get("product"), // referencia a Products
      quantity: record.get("quantity"),
      addons: record.get("addons"), // relación AddOns
      options: record.get("options"), // relación ProductOptions
      price: record.get("price"),
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
