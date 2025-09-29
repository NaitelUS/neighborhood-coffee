import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // ✅ Permite llamadas desde cualquier origen
};

const handler: Handler = async () => {
  try {
    // ✅ 1. Verificación de variable de entorno
    const tableName = process.env.AIRTABLE_TABLE_COUPONS;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_COUPONS en variables de entorno");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Missing AIRTABLE_TABLE_COUPONS env var",
        }),
      };
    }

    // ✅ 2. Consulta a Airtable (solo cupones activos)
    const records = await base(tableName)
      .select({ filterByFormula: "{active}=TRUE()" })
      .all();

    // ✅ 3. Mapeo de los campos esperados
    const coupons = records.map((record) => ({
      id: record.id,
      code: record.get("code"),
      discount: record.get("discount"),
      active: record.get("active"),
      expires_at: record.get("expires_at"),
    }));

    // ✅ 4. Respuesta correcta
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(coupons),
    };
  } catch (error) {
    console.error("❌ Error fetching coupons:", error);
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching coupons",
        message: (error as Error).message,
      }),
    };
  }
};

// ✅ 5. Export correcto (sin default)
export { handler };
