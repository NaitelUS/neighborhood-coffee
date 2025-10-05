import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const data = JSON.parse(event.body);

    // ✅ Nombres sincronizados con OrderPage.jsx
    const {
      customer_name,
      customer_phone,
      address,
      method, // Pickup | Delivery
      schedule,
      subtotal,
      discount_value,
      total,
      coupon,
      items,
    } = data;

    // Validaciones básicas
    if (!customer_name || !items || !Array.isArray(items)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid order data" }),
      };
    }

    // 📦 Crear orden principal
    const orderRecord = await base(TABLE_ORDERS).create([
      {
        fields: {
          Name: customer_name,
          Phone: customer_phone || "",
          Address: method === "Delivery" ? address || "" : "",
          OrderType: method || "Pickup",
          ScheduleTime: schedule || "",
          Subtotal: subtotal || 0,
          Discount: discount_value || 0,
          Total: total || 0,
          Coupon: coupon || "",
          Status: "Received",
        },
      },
    ]);

    const orderId = orderRecord[0].id;

    // 🧾 Crear ítems de la orden
    if (items && items.length > 0) {
      const orderItems = items.map((item) => ({
        fields: {
          Order: [orderId],
          ProductName: item.name,
          Option: item.option || "",
          Price: item.price || 0,
          AddOns: item.addons
            ? item.addons
                .map((a: any) => `${a.name} ($${a.price.toFixed(2)})`)
                .join(", ")
            : "",
        },
      }));

      // 🚀 Inserta por lotes (máximo 10 registros por llamada)
      while (orderItems.length > 0) {
        await base(TABLE_ORDERITEMS).create(orderItems.splice(0, 10));
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Order successfully created",
        orderId,
      }),
    };
  } catch (error: any) {
    console.error("❌ Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create order",
        details: error.message,
      }),
    };
  }
};
