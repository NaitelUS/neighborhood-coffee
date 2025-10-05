import { Handler } from "@netlify/functions";
import Airtable from "airtable";

// 🔑 Inicializar cliente de Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      console.error("❌ Missing body in request");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const data = JSON.parse(event.body);
    console.log("📦 Incoming Order Data:", data);

    const {
      customer_name = "",
      customer_phone = "",
      address = "",
      method = "Pickup", // Pickup | Delivery
      schedule = "",
      subtotal = 0,
      discount_value = 0,
      total = 0,
      coupon = "",
      items = [],
    } = data;

    if (!customer_name || !Array.isArray(items) || items.length === 0) {
      console.error("❌ Invalid order data:", data);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid order data" }),
      };
    }

    // 🧾 Crear registro principal en Orders
    const orderRecord = await base(TABLE_ORDERS).create([
      {
        fields: {
          Name: customer_name,
          Phone: customer_phone,
          Address: method === "Delivery" ? address : "",
          OrderType: method,
          ScheduleTime: schedule || "",
          Subtotal: subtotal,
          Discount: discount_value,
          Total: total,
          Coupon: coupon,
          Status: "Received",
          CreatedTime: new Date().toISOString(),
        },
      },
    ]);

    const orderId = orderRecord[0].id;
    console.log("✅ Order created with ID:", orderId);

    // 🧩 Crear los ítems vinculados
    if (Array.isArray(items) && items.length > 0) {
      const orderItems = items.map((item) => {
        const addons =
          Array.isArray(item.addons) && item.addons.length > 0
            ? item.addons
                .map((a: any) =>
                  a && a.name && typeof a.price === "number"
                    ? `${a.name} ($${a.price.toFixed(2)})`
                    : ""
                )
                .filter(Boolean)
                .join(", ")
            : "";

        return {
          fields: {
            Order: [orderId],
            ProductName: item.name || "Unnamed",
            Option: item.option || "",
            Price: typeof item.price === "number" ? item.price : 0,
            AddOns: addons,
          },
        };
      });

      console.log("🧾 Items to insert:", JSON.stringify(orderItems, null, 2));

      while (orderItems.length > 0) {
        await base(TABLE_ORDERITEMS).create(orderItems.splice(0, 10));
      }
      console.log("✅ All items inserted successfully");
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
        details: error.message || error.toString(),
      }),
    };
  }
};
