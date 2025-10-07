import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const TABLE_SETTINGS = process.env.AIRTABLE_TABLE_SETTINGS || "Settings";

export const handler: Handler = async () => {
  try {
    const base = getAirtableClient();

    // ✅ Obtener todos los registros activos de configuración
    const records = await base(TABLE_SETTINGS).select({ maxRecords: 1 }).all();

    if (!records.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No settings found" }),
      };
    }

    const settings = records[0].fields;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Settings loaded successfully",
        settings,
      }),
    };
  } catch (error) {
    console.error("❌ Error fetching settings:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error", error: String(error) }),
    };
  }
};
