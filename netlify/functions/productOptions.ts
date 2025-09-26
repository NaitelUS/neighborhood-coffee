import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_PRODUCT_OPTIONS!)
      .select()
      .all();

    const productOptions = records.map((record) => ({
      id: record.id,
      product: record.get("product"),
      value: record.get("value"),
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
