import { Handler } from "@netlify/functions";

const handler: Handler = async () => {
  try {
    // Obtenemos todas las variables del entorno relacionadas con Airtable
    const envVars = Object.keys(process.env)
      .filter((key) => key.startsWith("AIRTABLE_"))
      .reduce((obj: Record<string, string>, key) => {
        obj[key] = process.env[key] || "❌ NO DEFINIDA";
        return obj;
      }, {});

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          ok: true,
          message: "Variables de entorno de Airtable detectadas:",
          variables: envVars,
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.error("Error verificando variables:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Error verificando variables" }),
    };
  }
};

export { handler };
