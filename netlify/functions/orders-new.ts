import type { Handler } from "@netlify/functions";
import Airtable from "airtable";
// import twilio from "twilio"; // opcional, descomentaremos cuando tengas tus credenciales

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    const body = JSON.parse(event.body || "{}");

    const {
      customerName,
      phone,
      email,
      address,
      total,
      discount,
      subtotal,
      couponCode,
    } = body;

    if (!customerName || !total) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields (customerName or total).",
        }),
      };
    }

    // 🧾 Cálculo final (por si subtotal o descuento vienen nulos)
    const finalSubtotal = Number(subtotal || total);
    const finalDiscount = Number(discount || 0);
    const finalTotal = Number(total);

    // 🧠 Crear registro en Airtable
    const record = await base(TABLE).create([
      {
        fields: {
          CustomerName: customerName,
          Phone: phone || "",
          Email: email || "",
          Address: address || "",
          Subtotal: finalSubtotal,
          Discount: finalDiscount,
          Total: finalTotal,
          CouponCode: couponCode || "",
          Status: "Pending",
          Created: new Date().toISOString(),
        },
      },
    ]);

    const order = { id: record[0].id, ...record[0].fields };

    // ✅ Respuesta al cliente
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(order),
    };
  } catch (err: any) {
    console.error("Error creating order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
