import { Handler } from "@netlify/functions";
import Airtable from "airtable";

// 🧩 Inicializa Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const TABLE_PRODUCTS = process.env.AIRTABLE_TABLE_PRODUCTS || "Products";

// 🚀 Handler principal
export const handler: Handler = async (event) => {
  try {
    // 🧠 Valida que haya body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const { productIds } = JSON.parse(event.body);

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid productIds array" }),
      };
    }

    // 🗃️ Obtiene los productos desde Airtable
    const records = await base(TABLE_PRODUCTS)
      .select({
        view: "Grid view",
        fields: ["name", "available"],
      })
      .all();

    // ✅ Crea un mapa de disponibilidad
    const availabilityMap = new Map(
      records.map((rec) => [
        rec.id,
        {
          name: rec.get("name"),
          available: Boolean(rec.get("available")),
        },
      ])
    );

    // 🔍 Valida cada producto recibido
    const result = productIds.map((id) => {
      const info = availabilityMap.get(id);
      if (!info) {
        return {
          id,
          valid: false,
          reason: "Product not found",
        };
      }

      return {
        id,
        name: info.name,
        valid: info.available,
        reason: info.available ? "Available" : "Marked unavailable in Airtable",
      };
    });

    // 📦 Respuesta final
    return {
      statusCode: 200,
      body: JSON.stringify({
        validated: result,
        summary: {
          totalChecked: result.length,
          totalAvailable: result.filter((r) => r.valid).length,
        },
      }),
    };
  } catch (error) {
    console.error("❌ Error validating products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
