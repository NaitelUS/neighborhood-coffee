import Airtable from "airtable";

export async function handler() {
  try {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

    // Obtiene el primer registro de la tabla Settings
    const records = await base("Settings").select({ maxRecords: 1 }).firstPage();
    const settings = records[0].fields;

    return {
      statusCode: 200,
      body: JSON.stringify({
        earliestPickup: settings.earliestPickup,
        latestPickup: settings.latestPickup,
        earliestDelivery: settings.earliestDelivery,
        latestDelivery: settings.latestDelivery,
        timezone: settings.timezone,
        showSplash: settings.showSplash || false, // ✅ nuevo campo
        splashMessage: settings.splashMessage || "", // ✅ nuevo campo
      }),
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { statusCode: 500, body: "Error fetching settings" };
  }
}
