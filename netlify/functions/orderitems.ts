import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

// ✅ Cabeceras globales (JSON + CORS)
const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const handler: Handler = async () => {
  try {
    // ✅ 1. Verificamos la variable de entorno
    const tableName = process.env.AIRTABLE_TABLE_ORDERITEMS;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_ORDERITEMS en variables de entorno");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Missing AIRTABLE_TABLE_ORDERITEMS env var",
        }),
      };
    }

    // ✅ 2. Consultamos Airtable
    const records = await base(tableName).select().all();

    // ✅ 3. Mapeamos los registros a formato JSON limpio
    const orderItems = records.map((record) => ({
      id: record.id,
      order: record.get("order") ?? null,
      product: record.get("product") ?? null,
      quantity: record.get("quantity") ?? null,
      addons: record.get("addons") ?? null,
      options: record.get("options") ?? null,
      price: record.get("price") ?? null,
    }));

    // ✅ 4. Devolvemos respuesta correcta
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(orderItems),
    };
  } catch (error) {
    console.error("❌ Error fetching order items:", error);

    // 🚨 5. Manejo de error controlado
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching order items",
        message: (error as Error).message,
      }),
    };
  }
};

// ✅ 6. Export correcto para Netlify
export { handler };
