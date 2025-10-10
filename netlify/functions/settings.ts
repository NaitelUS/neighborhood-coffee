import Airtable from "airtable";

export async function handler() {
  try {
    // Inicializa conexión a Airtable
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID);

    // Obtiene todos los registros de la tabla Settings
    const records = await base("Settings").select().all();

    // Convierte las filas tipo name:value en un objeto
    const settingsObj: Record<string, any> = {};
    records.forEach((r) => {
      const name = r.get("name");
      const value = r.get("value");
      if (name && value !== undefined) settingsObj[name] = value;
    });

    // Busca la fila donde name = "Splash"
    const splashRow = records.find(
      (r) => r.get("name")?.toString().toLowerCase() === "splash"
    );

    // Verifica si el splash está activado
    const showSplash = splashRow?.get("showSplash") === true;
    const splashMessage = splashRow?.get("value") || "";

    // Devuelve JSON con todos los valores necesarios
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        open_hour: settingsObj.open_hour,
        close_hour: settingsObj.close_hour,
        active_days: settingsObj.active_days,
        holiday_dates: settingsObj.holiday_dates,
        timezone: settingsObj.timezone || "America/Denver",
        showSplash,
        splashMessage,
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
