import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

// ✅ Headers globales (JSON + CORS)
const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const handler: Handler = async () => {
  try {
    // ✅ 1. Verificar variable de entorno
    const tableName = process.env.AIRTABLE_TABLE_FEEDBACK;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_FEEDBACK en variables de entorno");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Missing AIRTABLE_TABLE_FEEDBACK env var",
        }),
      };
    }

    // ✅ 2. Consultar registros desde Airtable
    const records = await base(tableName)
      .select()
      .all();

    // ✅ 3. Mapeo limpio de los campos
    const feedback = records.map((record) => ({
      id: record.id,
      order_id: record.get("order_id") ?? null,
      rating: record.get("rating") ?? null,
      comments: record.get("comments") ?? null,
      contact_me: record.get("contact_me") ?? null,
    }));

    // ✅ 4. Respuesta exitosa
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(feedback),
    };
  } catch (error) {
    console.error("❌ Error fetching feedback:", error);

    // 🚨 5. Respuesta controlada de error
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching feedback",
        message: (error as Error).message,
      }),
    };
  }
};

// ✅ 6. Export correcta
export { handler };
