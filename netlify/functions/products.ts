import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    // ✅ Llamamos la tabla de productos desde las variables de entorno
    const records = await base(process.env.AIRTABLE_TABLE_PRODUCTS!)
      .select({ filterByFormula: "{active}=TRUE()" }) // opcional: filtra productos activos
      .all();

    // ✅ Mapeamos los campos esperados
    const products = records.map((record) => ({
      id: record.id,
      name: record.get("name"),
      description: record.get("description"),
      price: record.get("price"),
      category: record.get("category"),
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
