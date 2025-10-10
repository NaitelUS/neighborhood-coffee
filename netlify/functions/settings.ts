import Airtable from "airtable";

export async function handler() {
  try {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
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
        showSplash: settings.showSplash || false,
        splashMessage: settings.splashMessage || "",
      }),
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { statusCode: 500, body: "Error fetching settings" };
  }
}
