import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

// ✅ Nombre de la tabla
const TABLE_NAME = process.env.AIRTABLE_TABLE_SETTINGS || "Settings";

export const handler: Handler = async () => {
  try {
    // 🔹 Obtener todos los registros de Settings
    const records = await base(TABLE_NAME).select({}).all();

    // 🧠 Convertir lista de settings en objeto clave-valor
    const config: Record<string, any> = {};

    records.forEach((rec) => {
      const name = rec.get("name") as string;
      const value = rec.get("value");
      if (!name) return;

      switch (name) {
        case "open_hour":
        case "close_hour":
          config[name] = Number(value);
          break;

        case "active_days":
        case "holiday_dates":
          // Convierte texto plano "Monday,Tuesday" en array
          if (typeof value === "string") {
            config[name] = value
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean);
          } else {
            config[name] = [];
          }
          break;

        default:
          config[name] = value;
          break;
      }
    });

    // 🔧 Respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify(config),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (err: any) {
    console.error("❌ Error fetching settings:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown error" }),
    };
  }
};
