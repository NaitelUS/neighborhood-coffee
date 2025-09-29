import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

// ✅ Cabeceras JSON + CORS
const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const handler: Handler = async () => {
  try {
    // ✅ 1. Verificar variable de entorno
    const tableName = process.env.AIRTABLE_TABLE_PRODUCT_OPTIONS;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_PRODUCT_OPTIONS en variables de entorno");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Missing AIRTABLE_TABLE_PRODUCT_OPTIONS env var",
        }),
      };
    }

    console.log(`🧩 Consultando tabla: ${tableName}`);

    // ✅ 2. Consultar Airtable (solo activos)
    const records = await base(tableName)
      .select({ filterByFormula: "{active}=TRUE()" })
      .all();

    console.log(`📦 Registros encontrados: ${records.length}`);

    // ✅ 3. Mapeo de registros
    const productOptions = records.map((record) => ({
      id: record.id,
      product: record.get("product") ?? null,
      value: record.get("value") ?? null,
      extra_price: record.get("extra_price") ?? null,
      active: record.get("active") ?? null,
    }));

    // Si no hay registros, devuelve mensaje vacío (útil para debug)
    if (productOptions.length === 0) {
      console.warn("⚠️ No se encontraron registros activos en ProductOptions");
    }

    // ✅ 4. Respuesta exitosa
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(productOptions),
    };
  } catch (error) {
    console.error("❌ Error fetching ProductOptions:", error);

    // 🚨 5. Manejo controlado del error
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching ProductOptions",
        message: (error as Error).message,
      }),
    };
  }
};

// ✅ 6. Export correcto
export { handler };
