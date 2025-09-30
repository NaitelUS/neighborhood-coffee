import type { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  try {
    // ✅ Solo GET permitido
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const params = event.queryStringParameters || {};
    const orderId = params.id;

    if (!orderId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing order ID (id parameter required)" }),
      };
    }

    // 🔹 Buscar la orden principal
    const orderRecord = await base(TABLE_ORDERS).find(orderId);

    if (!orderRecord) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Order not found" }),
      };
    }

    const orderFields = orderRecord.fields;

    // 🧩 Estructura principal
    const orderData: any = {
      id: orderRecord.id,
      CustomerName: orderFields.CustomerName || "",
      Total: orderFields.Total || 0,
      Subtotal: orderFields.Subtotal || 0,
      Discount: orderFields.Discount || 0,
      CouponCode: orderFields.CouponCode || "",
      Phone: orderFields.Phone || "",
      Email: orderFields.Email || "",
      Address: orderFields.Address || "",
      Status: orderFields.Status || "Pending",
      Created: orderFields.Created || "",
      Items: [],
    };

    // 🔍 Buscar productos relacionados en OrderItems
    const items = await base(TABLE_ITEMS)
      .select({
        filterByFormula: `{Order} = '${orderId}'`,
        fields: ["ProductName", "Quantity", "Price", "AddOns", "Option"],
      })
      .all();

    orderData.Items = items.map((rec) => ({
      id: rec.id,
      ProductName: rec.fields.ProductName || "Unnamed item",
      Quantity: rec.fields.Quantity || 1,
      Price: rec.fields.Price || 0,
      Option: rec.fields.Option || "",
      AddOns: rec.fields.AddOns || [],
    }));

    // ✅ Respuesta completa
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
