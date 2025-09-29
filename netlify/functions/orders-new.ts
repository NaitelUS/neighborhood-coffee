import type { Handler } from "@netlify/functions";
import Airtable from "airtable";
import twilio from "twilio";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

// ⚙️ Configurar cliente Twilio si las variables existen
const twilioSID = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM_PHONE;
const client = twilioSID && twilioToken ? twilio(twilioSID, twilioToken) : null;

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

    // 1️⃣ Crear orden en Airtable
    const record = await base(TABLE).create([
      {
        fields: {
          CustomerName: customerName,
          Phone: phone || "",
          Email: email || "",
          Address: address || "",
          Total: Number(total),
          Subtotal: Number(subtotal || total),
          Discount: Number(discount || 0),
          CouponCode: couponCode || "",
          Status: "Pending",
          Created: new Date().toISOString(),
        },
      },
    ]);

    const order = { id: record[0].id, ...record[0].fields };

    // 2️⃣ Enviar SMS con Twilio (si está configurado)
    if (client && phone) {
      try {
        const message = await client.messages.create({
          body: `☕ Thank you, ${customerName}! Your order (${order.id}) has been received. We'll notify you when it's ready for pickup or delivery.`,
          from: twilioFrom,
          to: phone.startsWith("+") ? phone : `+1${phone}`, // fallback simple
        });
        console.log("SMS sent:", message.sid);
      } catch (smsErr: any) {
        console.error("Error sending SMS:", smsErr.message);
      }
    }

    // 3️⃣ Responder al cliente
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
