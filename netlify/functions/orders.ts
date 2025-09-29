import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

// ✅ Headers JSON + CORS
const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const handler: Handler = async () => {
  try {
    // ✅ 1. Verificamos variable de entorno
    const tableName = process.env.AIRTABLE_TABLE_ORDERS;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_ORDERS en variables de entorno");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Missing AIRTABLE_TABLE_ORDERS env var",
        }),
      };
    }

    // ✅ 2. Consultamos Airtable
    const records = await base(tableName)
      .select()
      .all();

    // ✅ 3. Mapeamos los campos de la tabla
    const orders = records.map((record) => ({
      id: record.id,
      order_number: record.get("order_number") ?? null,
      customer: record.get("customer") ?? null,
      total: record.get("total") ?? null,
      status: record.get("status") ?? null,
      coupon: record.get("coupon") ?? null,
      scheduled_for: record.get("scheduled_for") ?? null,
      created_at: record.get("created_at") ?? null,
    }));

    // ✅ 4. Devolvemos respuesta exitosa
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(orders),
    };
  } catch (error) {
    console.error("❌ Error fetching orders:", error);

    // 🚨 5. Manejo de errores controlado
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching orders",
        message: (error as Error).message,
      }),
    };
  }
};

// ✅ 6. Export correcto
export { handler };
