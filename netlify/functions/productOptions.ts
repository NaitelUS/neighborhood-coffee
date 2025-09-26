import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_PRODUCT_OPTIONS!)
      .select()
      .all();

    const productOptions = records.map((record) => ({
      id: record.id,
      product: record.get("product"), // referencia a Products
      value: record.get("value"), // Hot, Iced, Apple, Pineapple, etc.
      extra_price: record.get("extra_price"),
      active: record.get("active"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(productOptions),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching product options" }),
    };
  }
};

export { handler };
