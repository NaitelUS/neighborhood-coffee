import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    // Verificar que la variable de entorno esté definida
    const tableName = process.env.AIRTABLE_TABLE_ADDONS;
    if (!tableName) {
      console.error("❌ Variable AIRTABLE_TABLE_ADDONS no definida");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing AIRTABLE_TABLE_ADDONS env var" }),
      };
    }

    // Consultar Airtable con filtro de solo activos
    const records = await base(tableName)
      .select({ filterByFormula: "{active}=TRUE()" })
      .all();

    // Mapear los registros a un formato limpio
    const addons = records.map((record) => ({
      id: record.id,
      name: record.get("name"),
      extra_price: record.get("extra_price"),
      active: record.get("active"),
    }));

    // Respuesta exitosa
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(addons),
    };
  } catch (error) {
    console.error("❌ Error fetching addons:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Error fetching addons",
        message: (error as Error).message,
      }),
    };
  }
};

export { handler };
