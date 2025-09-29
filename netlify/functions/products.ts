import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

// ✅ Cabeceras globales (JSON + CORS)
const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const handler: Handler = async () => {
  try {
    // ✅ 1. Verificación de variable de entorno
    const tableName = process.env.AIRTABLE_TABLE_PRODUCTS;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_PRODUCTS en variables de entorno");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Missing AIRTABLE_TABLE_PRODUCTS env var",
        }),
      };
    }

    // ✅ 2. Consulta a Airtable (filtra solo activos si quieres)
    const records = await base(tableName)
      .select({ filterByFormula: "{active}=TRUE()" }) // puedes comentar esto si deseas todos
      .all();

    // ✅ 3. Mapeo de campos esperados
    const products = records.map((record) => ({
      id: record.id,
      name: record.get("name") ?? null,
      description: record.get("description") ?? null,
      price: record.get("price") ?? null,
      category: record.get("category") ?? null,
      image_url: record.get("image_url") ?? null,
      active: record.get("active") ?? null,
    }));

    // ✅ 4. Respuesta exitosa
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error("❌ Error fetching products:", error);

    // 🚨 5. Manejo controlado de errores
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching products",
        message: (error as Error).message,
      }),
    };
  }
};

// ✅ 6. Export correcto
export { handler };
