import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

// ✅ Cabeceras JSON + CORS
const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const handler: Handler = async () => {
  try {
    // ✅ 1. Verificación de variable de entorno
    const tableName = process.env.AIRTABLE_TABLE_MESSAGES;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_MESSAGES en variables de entorno");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Missing AIRTABLE_TABLE_MESSAGES env var",
        }),
      };
    }

    // ✅ 2. Consultar Airtable
    const records = await base(tableName).select().all();

    // ✅ 3. Mapear registros a formato JSON limpio
    const messages = records.map((record) => ({
      id: record.id,
      name: record.get("name") ?? null,
      email: record.get("email") ?? null,
      message: record.get("message") ?? null,
      created_at: record.get("created_at") ?? null,
    }));

    // ✅ 4. Devolver respuesta correcta
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(messages),
    };
  } catch (error) {
    console.error("❌ Error fetching messages:", error);

    // 🚨 5. Error controlado
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching messages",
        message: (error as Error).message,
      }),
    };
  }
};

// ✅ 6. Exportación nombrada (Netlify busca { handler })
export { handler };
