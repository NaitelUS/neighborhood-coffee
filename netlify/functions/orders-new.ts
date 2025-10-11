import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID || ""
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const {
      name,
      phone,
      address,
      orderType,
      scheduleDate,
      scheduleTime,
      subtotal,
      discount,
      total,
      coupon,
      notes,
      items,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No items provided" }),
      };
    }

    // 🧩 Agrupar productos idénticos antes de enviarlos
    const groupedItems = Object.values(
      items.reduce((acc: Record<string, any>, item) => {
        const key = `${item.product_name}-${item.option || ""}-${(item.addons ||
          [])
          .map((a: any) => (typeof a === "string" ? a : a.name))
          .sort()
          .join(",")}`;
        if (!acc[key]) {
          acc[key] = { ...item, qty: item.qty || 1 };
        } else {
          acc[key].qty += item.qty || 1;
        }
        return acc;
      }, {})
    );

    // 🧾 Crear un OrderID y OrderNumber
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const orderId = `TNC-${timestamp}`;
    const orderNumber = Math.floor(Math.random() * 1000000);

    // 🧱 Crear registro principal (Orders)
    const [orderRecord] = await base("Orders").create([
      {
        fields: {
          Name: name || "",
          Phone: phone || "",
          Address: address || "",
          OrderType: orderType || "",
          ScheduleDate: scheduleDate || "",
          ScheduleTime: scheduleTime || "",
          Subtotal: subtotal || 0,
          Discount: discount || 0,
          Total: total || 0,
          Coupon: coupon || "",
          Notes: notes || "",
          Status: "Received",
          OrderID: orderId,
          OrderNumber: orderNumber,
          Date: new Date().toISOString(),
          CreatedAt: new Date().toISOString(),
        },
      },
    ]);

    // 📦 Crear registros en OrderItems
    const orderItemRecords = groupedItems.map((item: any) => ({
      fields: {
        Order: orderId,
        ProductName: item.product_name,
        Option: item.option || "",
        AddOns:
          typeof item.addons === "string"
            ? item.addons
            : item.addons?.map((a: any) => a.name || a).join(", "),
        Price: item.price || 0,
        Qty: item.qty || 1,
      },
    }));

    await base("OrderItems").create(orderItemRecords);

    console.log(`✅ Order created: ${orderId} (${orderItemRecords.length} items)`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        id: orderId,
        orderNumber,
        groupedItemsCount: groupedItems.length,
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
