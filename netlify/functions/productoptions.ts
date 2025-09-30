import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

// Inicializar Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_PRODUCT_OPTIONS || "ProductOptions";

export const handler: Handler = async () => {
  try {
    const records = await base(TABLE).select({}).all();

    const formatted = records.map((record) => ({
      id: record.id,
      productId: record.fields.Product?.[0], // 🔗 referencia al producto principal
      optionName: record.fields.OptionName || "",
      description: record.fields.Description || "",
      price: Number(record.fields.Price) || 0,
      image_url: record.fields.Image_URL || "",
      active: record.fields.Active ?? true,
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(formatted),
    };
  } catch (err: any) {
    console.error("Error loading product options:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
