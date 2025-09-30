import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

export const handler: Handler = async (event) => {
  try {
    // ✅ Solo aceptar método GET
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const params = event.queryStringParameters || {};
    const orderId = params.id;

    // ✅ Validar parámetro
    if (!orderId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing order ID (id parameter required)" }),
      };
    }

    // 🔍 Buscar el registro por ID
    const record = await base(TABLE).find(orderId);

    if (!record) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Order not found" }),
      };
    }

    // 🧩 Extraer campos relevantes
    const fields = record.fields;

    const orderData = {
      id: record.id,
      CustomerName: fields.CustomerName || "",
      Total: fields.Total || 0,
      Subtotal: fields.Subtotal || 0,
      Discount: fields.Discount || 0,
      CouponCode: fields.CouponCode || "",
      Phone: fields.Phone || "",
      Email: fields.Email || "",
      Address: fields.Address || "",
      Status: fields.Status || "Pending",
      Created: fields.Created || "",
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(orderData),
    };
  } catch (err: any) {
    console.error("Error fetching order:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
