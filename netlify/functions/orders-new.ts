import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

// 🔐 Variables desde Netlify
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  throw new Error("❌ Falta AIRTABLE_API_KEY o AIRTABLE_BASE_ID en las variables de entorno.");
}

// 🧱 Conexión a Airtable
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// 📋 Tablas fijas
const TABLE_ORDERS = "Orders";
const TABLE_ORDER_ITEMS = "OrderItems";

// 🛠️ Headers CORS
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// 🔢 Identificadores de orden
function makeOrderIdentifiers() {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(100 + Math.random() * 900);
  return {
    orderNumber: `TNC-${ymd}-${rand}`,
    orderId: `${ymd}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  };
}

// 🔄 Crear en lotes (Airtable máx. 10 por request)
async function createInChunks(table: string, records: { fields: any }[]) {
  const chunkSize = 10;
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    await base(table).create(chunk);
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    // ✅ Datos recibidos del frontend (OrderPage.tsx)
    const {
      customer_name,
      customer_phone,
      address,
      order_type,
      schedule_date,
      schedule_time,
      subtotal,
      discount,
      total,
      coupon_code,
      notes,
      items,
    } = data;

    // ⚙️ Validaciones mínimas
    if (!customer_name || !customer_phone || !order_type || !items?.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Faltan campos obligatorios." }),
      };
    }

    // 🕒 Timestamp y numeración
    const { orderNumber, orderId } = makeOrderIdentifiers();
    const createdAt = new Date().toISOString();

    // 📦 Crear registro en Orders
    const orderFields = {
      Name: customer_name,
      Phone: customer_phone,
      OrderType: order_type,
      Address: address || "",
      ScheduleDate: schedule_date || "",
      ScheduleTime: schedule_time || "",
      Subtotal: Number(subtotal) || 0,
      Discount: Number(discount) || 0,
      Total: Number(total) || 0,
      Coupon: coupon_code || "",
      Notes: notes || "",
      Status: "Received",
      OrderNumber: orderNumber,
      OrderID: orderId,
      CreatedAt: createdAt,
    };

    const [orderRecord] = await base(TABLE_ORDERS).create([{ fields: orderFields }]);

    // 🧾 Crear OrderItems
    const itemRecords = items.map((item: any) => {
      const addOns =
        Array.isArray(item.addons) && item.addons.length > 0
          ? item.addons.map((a: any) => (a.name ? `${a.name} (+$${a.price})` : a)).join(", ")
          : "";

      return {
        fields: {
          OrderNumber: orderNumber,
          ProductName: item.name || "Unnamed item",
          Option: item.option || "",
          AddOns: addOns,
          Price: Number(item.price) || 0,
        },
      };
    });

    await createInChunks(TABLE_ORDER_ITEMS, itemRecords);

    // ✅ Respuesta
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        orderNumber,
        orderId,
        airtableId: orderRecord.id,
        createdAt,
      }),
    };
  } catch (err: any) {
    console.error("❌ Error en orders-new:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error creando la orden.",
        details: err.message,
      }),
    };
  }
};

export default handler;
