const { getAirtableClient } = require("../lib/airtableClient");

exports.handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base("Settings");

    // Lee el primer registro (o puedes filtrar por un "Active = true" si lo tienes)
    const rows = await table.select({ maxRecords: 1 }).firstPage();
    if (!rows.length) {
      return {
        statusCode: 200,
        body: JSON.stringify({ splashEnabled: false }),
      };
    }

    const f = rows[0].fields || {};
    const splashEnabled =
      f.SplashEnabled ?? f.Splash ?? f.ShowSplash ?? false;
    const splashImage =
      f.SplashImage || f.Image || f.BannerImage || "";
    const splashText =
      f.SplashText || f.Text || f.Message || "";

    return {
      statusCode: 200,
      body: JSON.stringify({
        splashEnabled: Boolean(splashEnabled),
        splashImage,
        splashText,
      }),
    };
  } catch (error) {
    console.error("settings error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error", details: error.message }) };
  }
};
