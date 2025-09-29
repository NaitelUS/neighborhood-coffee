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
    const tableName = process.env.AIRTABLE_TABLE_USERS;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_USERS en variables de entorno");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Missing AIRTABLE_TABLE_USERS env var",
        }),
      };
    }

    // ✅ 2. Consulta a Airtable
    const records = await base(tableName)
      .select({ filterByFormula: "{active}=TRUE()" }) // opcional: solo usuarios activos
      .all();

    // ✅ 3. Mapeo de registros
    const users = records.map((record) => ({
      id: record.id,
      name: record.get("name") ?? null,
      email: record.get("email") ?? null,
      role: record.get("role") ?? null,
      active: record.get("active") ?? null,
    }));

    // ✅ 4. Respuesta exitosa
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error("❌ Error fetching users:", error);

    // 🚨 5. Manejo controlado del error
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching users",
        message: (error as Error).message,
      }),
    };
  }
};

// ✅ 6. Exportación nombrada (Netlify busca “handler”)
export { handler };
