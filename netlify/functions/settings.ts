import Airtable from "airtable";

export async function handler() {
  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID);

    // Obtener todos los registros de Settings
    const records = await base("Settings").select().all();

    // Crear objeto con todas las configuraciones
    const settings: Record<string, any> = {};
    records.forEach((r) => {
      const name = r.get("name")?.toString();
      const value = r.get("value");
      if (name) settings[name] = value;
    });

    // Buscar el registro Splash específicamente
    const splashRecord = records.find(
      (r) => r.get("name")?.toString().toLowerCase() === "splash"
    );

    // Si existe el registro Splash, tomar el valor y el checkbox showSplash
    const showSplash = splashRecord?.get("showSplash") === true;
    const splashMessage =
      (splashRecord?.get("value") as string) ||
      "Welcome to The Neighborhood Coffee ☕";

    // Respuesta JSON
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        open_hour: settings.open_hour || "6",
        close_hour: settings.close_hour || "11",
        active_days: settings.active_days || "",
        holiday_dates: settings.holiday_dates || "",
        timezone: settings.timezone || "America/Denver",
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
        details: (error as Error).message,
      }),
    };
  }
}
