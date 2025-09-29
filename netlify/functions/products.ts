import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_PRODUCTS!)
      .select({ filterByFormula: "{active}=TRUE()" })
      .all();

    const products = records.map((record) => ({
      id: record.id,
      name: record.get("name"),
      description: record.get("description"),
      price: record.get("price"),
      image_url: record.get("image_url"),
      active: record.get("active"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching products" }),
    };
  }
};

export { handler };
