import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_PRODUCTS || "Products");

    const records = await table.select().all();

    const products = records.map((record) => {
      const fields = record.fields;

      // ✅ Manejo seguro de la imagen
      const imageField =
        (Array.isArray(fields.Image) && fields.Image[0]?.url) ||
        fields.image_url ||
        fields.image ||
        null;

      return {
        id: record.id,
        name: fields.name || "Unnamed Product",
        description: fields.description || "",
        category: fields.category || "Drink",
        price: Number(fields.price) || 0,
        image_url: imageField, // 👈 siempre devuelve algo definido
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load products" }),
    };
  }
};

export { handler };
