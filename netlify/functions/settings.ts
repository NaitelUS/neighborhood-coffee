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
    const tableName = process.env.AIRTABLE_TABLE_SETTINGS;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_SETTINGS en variables de entorno");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Missing AIRTABLE_TABLE_SETTINGS env var",
        }),
      };
    }

    // ✅ 2. Consulta a Airtable
    const records = await base(tableName).select().all();

    // ✅ 3. Mapeo de los campos esperados
    const settings = records.map((record) => ({
      id: record.id,
      key: record.get("key") ?? null,
      value: record.get("value") ?? null,
      description: record.get("description") ?? null, // opcional si existe
    }));

    // ✅ 4. Respuesta exitosa
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(settings),
    };
  } catch (error) {
    console.error("❌ Error fetching settings:", error);

    // 🚨 5. Manejo controlado del error
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching settings",
        message: (error as Error).message,
      }),
    };
  }
};

// ✅ 6. Exportación nombrada
export { handler };
