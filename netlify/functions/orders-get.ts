import { Handler } from "@netlify/functions";
import Airtable from "airtable";

// 🧩 Inicializa cliente Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

// 🚀 Handler principal
export const handler: Handler = async () => {
  try {
    // 🧾 Obtener órdenes
    const orders = await base(TABLE_ORDERS)
      .select({
        view: "Grid view",
        fields: [
          "Name",
          "Phone",
          "Address",
          "OrderType",
          "ScheduleDate",
          "ScheduleTime",
          "Subtotal",
          "Discount",
          "Total",
          "Coupon",
          "Status",
        ],
      })
      .all();

    // 📦 Obtener ítems de todas las órdenes
    const orderItems = await base(TABLE_ORDERITEMS)
      .select({
        view: "Grid view",
        fields: ["Order", "ProductName", "Option", "Price", "AddOns"],
      })
      .all();

    // 🧩 Agrupar items por Order ID
    const groupedItems = orderItems.reduce<Record<string, any[]>>((acc, rec) => {
      const orderId = (rec.get("Order") as string[] | undefined)?.[0];
      if (orderId) {
        if (!acc[orderId]) acc[orderId] = [];
        acc[orderId].push({
          id: rec.id,
          name: rec.get("ProductName"),
          option: rec.get("Option"),
          price: rec.get("Price"),
          addons: rec.get("AddOns"),
        });
      }
      return acc;
    }, {});

    // 🧱 Formatear respuesta final
    const response = orders.map((rec) => {
      const id = rec.id;
      return {
        id,
        name: rec.get("Name"),
        phone: rec.get("Phone"),
        address: rec.get("Address"),
        orderType: rec.get("OrderType"),
        scheduleDate: rec.get("ScheduleDate"),
        scheduleTime: rec.get("ScheduleTime"),
        subtotal: rec.get("Subtotal"),
        discount: rec.get("Discount"),
        total: rec.get("Total"),
        coupon: rec.get("Coupon"),
        status: rec.get("Status"),
        items: groupedItems[id] || [],
      };
    });

    // ✅ Respuesta final
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch orders" }),
    };
  }
};
