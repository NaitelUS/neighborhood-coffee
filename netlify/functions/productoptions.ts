// ✅ productoptions.ts (todo en minúsculas)
import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const handler: Handler = async () => {
  try {
    const tableName = process.env.AIRTABLE_TABLE_PRODUCT_OPTIONS;
    if (!tableName) {
      console.error("❌ Falta AIRTABLE_TABLE_PRODUCT_OPTIONS");
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({ error: "Missing env var" }),
      };
    }

    console.log(`🧩 Consultando tabla: ${tableName}`);

    const records = await base(tableName)
      .select({ filterByFormula: "{active}=TRUE()" })
      .all();

    console.log(`📦 Registros encontrados: ${records.length}`);

    const productoptions = records.map((record) => ({
      id: record.id,
      product: record.get("product") ?? null,
      value: record.get("value") ?? null,
      extra_price: record.get("extra_price") ?? null,
      active: record.get("active") ?? null,
    }));

    if (productoptions.length === 0) {
      console.warn("⚠️ No se encontraron registros activos en productoptions");
    }

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(productoptions),
    };
  } catch (error) {
    console.error("❌ Error fetching productoptions:", error);
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Error fetching productoptions",
        message: (error as Error).message,
      }),
    };
  }
};

export { handler };
