import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const handler: Handler = async () => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_PRODUCTS!)
      .select({ filterByFormula: "{active}=TRUE()" }) // solo activos
      .all();

    const products = records.map((record) => ({
      id: record.id,
      name: record.get("name"),
      description: record.get("description"),
      price: record.get("price"),
      image: record.get("image_url"),
      active: record.get("active"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching products" }),
    };
  }
};

export { handler };
