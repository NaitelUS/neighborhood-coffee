import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

// Inicializar conexión con Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

// Nombre de la tabla (por variable o por defecto)
const TABLE = process.env.AIRTABLE_TABLE_PRODUCTS || "Products";

export const handler: Handler = async (event) => {
  try {
    // Solo permite POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Leer datos enviados
    const body = JSON.parse(event.body || "{}");
    const {
      name,
      description,
      price,
      image_url,
      active,
    } = body;

    // Crear registro en Airtable
    const record = await base(TABLE).create([
      {
        fields: {
          Name: name || "New Product",
          Description: description || "",
          Price: Number(price) || 0,
          Image_URL: image_url || "",
          Active: !!active,
          Created: new Date().toISOString(),
        },
      },
    ]);

    // Responder con ID creado
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id: record[0].id,
        message: "✅ Product created successfully",
      }),
    };
  } catch (err: any) {
    console.error("Error creating product:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message || "Error creating product",
      }),
    };
  }
};
