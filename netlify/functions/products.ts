import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_PRODUCTS = process.env.AIRTABLE_TABLE_PRODUCTS || "Products";

export const handler: Handler = async () => {
  try {
    const records = await base(TABLE_PRODUCTS)
      .select({
        fields: [
          "name",
          "description",
          "price",
          "category",
          "is_hot",
          "is_iced",
          "available",
          "image_url",
        ],
        filterByFormula: "available", // solo productos activos
      })
      .all();

    const products = records.map((record) => ({
      id: record.id,
      name: record.get("name") || "Unnamed Product",
      description: record.get("description") || "",
      category: record.get("category") || "General",
      price: record.get("price") || 0,
      is_hot: record.get("is_hot") || false,
      is_iced: record.get("is_iced") || false,
      available: record.get("available") || false,
      image_url:
        record.get("image_url") ||
        "/attached_assets/tnclogo.png", // fallback si no hay imagen
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products, null, 2),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch products" }),
    };
  }
};
