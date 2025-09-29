import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_FEEDBACK || "Feedback";

export const handler: Handler = async (event) => {
  try {
    const { orderId } = event.queryStringParameters || {};

    // 📋 Configuración base
    const selectOptions: any = {
      sort: [{ field: "Created", direction: "desc" }],
    };

    // 🎯 Si se pasa orderId por query string, filtra por esa orden
    if (orderId) {
      selectOptions.filterByFormula = `FIND('${orderId}', ARRAYJOIN({Order}))`;
    }

    // 📡 Consulta en Airtable
    const records = await base(TABLE).select(selectOptions).all();

    const data = records.map((r) => ({
      id: r.id,
      ...r.fields,
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
