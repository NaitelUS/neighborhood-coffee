import { Handler } from "@netlify/functions";
import Airtable from "airtable";

// 🧩 Configuración base
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const TABLE_PRODUCTS = process.env.AIRTABLE_TABLE_PRODUCTS || "Products";

// 🚀 Handler principal
export const handler: Handler = async () => {
  try {
    const records = await base(TABLE_PRODUCTS)
      .select({
        view: "Grid view",
        fields: [
          "name",
          "description",
          "category",
          "price",
          "is_hot",
          "is_iced",
          "available",
          "image_url",
        ],
      })
      .all();

    // ✅ Mapea los registros
    const products = records.map((record) => ({
      id: record.id,
      name: record.get("name") as string,
      description: record.get("description") as string,
      category: record.get("category") as string,
      price: record.get("price") as number,
      is_hot: Boolean(record.get("is_hot")),
      is_iced: Boolean(record.get("is_iced")),
      available: Boolean(record.get("available")),
      image_url: record.get("image_url") as string,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch products" }),
    };
  }
};
