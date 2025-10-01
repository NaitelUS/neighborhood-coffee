import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_PRODUCTS =
  process.env.AIRTABLE_TABLE_PRODUCTS || "Products";

export const handler: Handler = async () => {
  try {
    const records = await base(TABLE_PRODUCTS)
      .select({ view: "Grid view" })
      .all();

    const products = records.map((record) => ({
      id: record.id,
      name: record.get("name") || "Unnamed Product",
      description: record.get("description") || "",
      price: record.get("price") || 0,
      category: record.get("category") || "",
      is_hot: record.get("is_hot") || false,
      is_iced: record.get("is_iced") || false,
      available: record.get("available") ?? true,
      image_url:
        record.get("image_url") ||
        (record.get("image") && record.get("image")[0]?.url) ||
        "",
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch products" }),
    };
  }
};
