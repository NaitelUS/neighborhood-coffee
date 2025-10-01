import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_ADDONS || "Addons");

    // 🔹 Obtener todos los registros
    const records = await table.select().all();

    // 🔹 Mapear los campos esperados
    const addons = records
      .map((record) => ({
        id: record.id,
        name: record.fields.name || "",
        price: Number(record.fields.price) || 0,
        description: record.fields.description || "", // ✅ nuevo campo
        active: record.fields.active ?? true,
      }))
      .filter((addon) => addon.active); // ✅ solo activos

    return {
      statusCode: 200,
      body: JSON.stringify(addons),
    };
  } catch (error: any) {
    console.error("❌ Error fetching addons:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch addons",
        details: error.message || error,
      }),
    };
  }
};

export { handler };
