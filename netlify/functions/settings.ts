import Airtable from "airtable";

export async function handler() {
  try {
    // Inicializa la conexión a Airtable
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID);

    // Obtiene el primer registro de la tabla "Settings"
    const records = await base("Settings").select({ maxRecords: 1 }).firstPage();
    const settings = records[0]?.fields || {};

    // Devuelve los campos relevantes como JSON
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // útil para evitar errores CORS
      },
      body: JSON.stringify({
        earliestPickup: settings.earliestPickup || "",
        latestPickup: settings.latestPickup || "",
        earliestDelivery: settings.earliestDelivery || "",
        latestDelivery: settings.latestDelivery || "",
        timezone: settings.timezone || "America/Chicago",
        showSplash: settings.showSplash || false, // ✅ nuevo campo
        splashMessage: settings.splashMessage || "", // ✅ mensaje dinámico
      }),
    };
  } catch (error) {
    console.error("Error fetching settings:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error fetching settings",
        details: error.message,
      }),
    };
  }
}
