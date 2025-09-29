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
    const tableName = process.env.AIRTABLE_TABLE_CUSTOMERS;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_CUSTOMERS en variables de entorno");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Missing AIRTABLE_TABLE_CUSTOMERS env var",
        }),
      };
    }

    // ✅ 2. Consultamos Airtable
    const records = await base(tableName)
      .select({ filterByFormula: "{active}=TRUE()" }) // Opcional: solo clientes activos
      .all();

    // ✅ 3. Mapeamos los registros a un formato limpio
    const customers = records.map((record) => ({
      id: record.id,
      name: record.get("name") ?? null,
      email: record.get("email") ?? null,
      phone: record.get("phone") ?? null,
      active: record.get("active") ?? null,
    }));

    // ✅ 4. Respuesta correcta
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(customers),
    };
  } catch (error) {
    console.error("❌ Error fetching customers:", error);

    // 🚨 5. Respuesta controlada en caso de error
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching customers",
        message: (error as Error).message,
      }),
    };
  }
};

// ✅ 6. Export correcto (Netlify busca “handler”)
export { handler };
