import type { Handler } from "@netlify/functions";
import Airtable from "airtable";
import twilio from "twilio";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

// ⚙️ Configurar Twilio solo si las variables existen
const twilioSID = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM_PHONE;
const client = twilioSID && twilioToken ? twilio(twilioSID, twilioToken) : null;

// 📩 Mensajes automáticos por estado
const STATUS_MESSAGES: Record<string, string> = {
  Pending: "☕ Your order has been received and is pending confirmation.",
  Preparing: "👨‍🍳 Your order is being prepared. We'll notify you when it’s ready!",
  Ready: "🚗 Your order is ready for pickup or delivery!",
  "Out for Delivery": "🚚 Your order is on its way!",
  Completed:
    "✅ Your order is complete. Thank you! We'd love your feedback at /feedback?order=",
  Cancelled:
    "❌ Your order has been cancelled. If this was a mistake, please contact us.",
};

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "PATCH") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    const { id, status } = JSON.parse(event.body || "{}");

    if (!id || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing 'id' or 'status'.",
        }),
      };
    }

    // 1️⃣ Obtener registro existente para leer teléfono y nombre
    const existing = await base(TABLE).find(id);
    const customerName =
      (existing.fields.CustomerName as string) || "Customer";
    const phone = existing.fields.Phone as string | undefined;

    // 2️⃣ Actualizar estado y LastUpdated en Airtable
    const updated = await base(TABLE).update([
      {
        id,
        fields: {
          Status: status,
          LastUpdated: new Date().toISOString(),
        },
      },
    ]);

    const order = { id, ...updated[0].fields };

    // 3️⃣ Enviar SMS (si Twilio configurado)
    if (client && phone) {
      const baseMessage = STATUS_MESSAGES[status] || "";
      if (baseMessage) {
        try {
          const finalMessage =
            status === "Completed"
              ? `${baseMessage}${id}`
              : baseMessage;

          const msg = await client.messages.create({
            body: finalMessage,
            from: twilioFrom,
            to: phone.startsWith("+") ? phone : `+1${phone}`, // fallback simple
          });

          console.log("SMS sent:", msg.sid);
        } catch (smsErr: any) {
          console.error("Error sending SMS:", smsErr.message);
        }
      }
    }

    // 4️⃣ Responder al cliente
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(order),
    };
  } catch (err: any) {
    console.error("Error updating order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
