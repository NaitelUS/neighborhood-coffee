import { Handler } from "@netlify/functions";
import Airtable from "airtable";

// 🔐 Conexión segura a Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  try {
    // ✅ Valida que haya datos
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const data = JSON.parse(event.body);

    const {
      customer_name,
      customer_phone,
      address,
      order_type, // Pickup | Delivery
      schedule_date, // ✅ Nuevo campo separado
      schedule_time, // ✅ Nuevo campo separado
      subtotal,
      discount,
      total,
      coupon_code,
      status,
      items,
    } = data;

    // ⚠️ Validaciones básicas
    if (!customer_name || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid order data" }),
      };
    }

    // ✅ Crear registro principal en Orders
    const orderRecord = await base(TABLE_ORDERS).create([
      {
        fields: {
          Name: customer_name,
          Phone: customer_phone || "",
          Address: order_type === "Delivery" ? address || "" : "",
          OrderType: order_type || "Pickup",
          ScheduleDate: schedule_date || "",
          ScheduleTime: schedule_time || "",
          Subtotal: subtotal || 0,
          Discount: discount || 0,
          Total: total || 0,
          Coupon: coupon_code || "",
          Status: status || "Received",
        },
      },
    ]);

    const orderId = orderRecord[0].id;

    // ✅ Crear registros en OrderItems (relación con Orders)
    if (items && items.length > 0) {
      const orderItems = items.map((item) => ({
        fields: {
          Order: [orderId], // 🔗 relación con la orden
          ProductName: item.name,
          Option: item.option || "",
          Price: item.price || 0,
          AddOns:
            item.addons && item.addons.length > 0
              ? item.addons.join(", ")
              : "",
        },
      }));

      // Airtable solo acepta 10 por batch
      while (orderItems.length > 0) {
        await base(TABLE_ORDERITEMS).create(orderItems.splice(0, 10));
      }
    }

    // ✅ Respuesta de éxito
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
