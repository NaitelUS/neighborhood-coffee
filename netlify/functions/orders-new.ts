import { Handler } from "@netlify/functions";
import Airtable from "airtable";

// 🧩 Inicializa cliente Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

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

    const data = JSON.parse(event.body);

    const {
      customer_name,
      customer_phone,
      address,
      order_type, // Pickup | Delivery
      schedule_date,
      schedule_time,
      subtotal,
      discount,
      total,
      coupon_code,
      items,
    } = data;

    // 🧱 Validaciones básicas
    if (!customer_name || !items || !Array.isArray(items)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid order data" }),
      };
    }

    // 🧾 Crea la orden principal
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
          Status: "Received",
        },
      },
    ]);

    const orderId = orderRecord[0].id;

    // 🧩 Crea los ítems de la orden
    if (items && items.length > 0) {
      const orderItems = items.map((item) => ({
        fields: {
          Order: [orderId],
          ProductName: item.name,
          Option: item.option || "",
          Price: item.price || 0,
          AddOns: item.addons
            ? item.addons.map((a: any) => `${a.name} ($${a.price.toFixed(2)})`).join(", ")
            : "",
        },
      }));

      // 🚀 Inserta en lotes de 10 (límite de Airtable)
      while (orderItems.length > 0) {
        await base(TABLE_ORDERITEMS).create(orderItems.splice(0, 10));
      }
    }

    // ✅ Éxito
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Order successfully created",
        orderId,
      }),
    };
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create order" }),
    };
  }
};
