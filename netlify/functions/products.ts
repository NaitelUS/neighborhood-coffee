import type { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  const base = getAirtableClient();
  const tableName = process.env.AIRTABLE_TABLE_PRODUCTS;

  if (!tableName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "❌ Missing AIRTABLE_TABLE_PRODUCTS variable" }),
    };
  }

  try {
    const records = await base(tableName)
      .select({ filterByFormula: "{available}=TRUE()" })
      .all();

    const products = records.map((record) => ({
      id: record.id,
      name: record.get("name") || "",
      description: record.get("description") || "",
      price: record.get("price") || 0,
      is_hot: record.get("is_hot") || false,
      is_iced: record.get("is_iced") || false,
      image_url: record.get("image_url") || "",
      available: record.get("available") || false,
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(products),
    };
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching products", message: error.message }),
    };
  }
};

export { handler };
