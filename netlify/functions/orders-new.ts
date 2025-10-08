import { Handler } from "@netlify/functions";
import Airtable from "airtable";

// Inicializar conexión
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

// 🧠 Obtener siguiente número consecutivo
async function getNextOrderNumber() {
  try {
    const records = await base(TABLE_ORDERS)
      .select({
        sort: [{ field: "OrderNumber", direction: "desc" }],
        maxRecords: 1,
      })
      .firstPage();

    if (records.length > 0) {
      const last = records[0].fields["OrderNumber"];
      if (typeof last === "number") return last + 1;
    }
    return 1;
  } catch (err) {
    console.error("⚠️ Error fetching last order number:", err);
    return 1;
  }
}

export const handler: Handler = async (event) => {
  try {
    const orderData = JSON.parse(event.body || "{}");
    console.log("🧾 Incoming order:", orderData);

    // Generar número consecutivo
    const nextNumber = await getNextOrderNumber();
    const shortId = `TNC-${String(nextNumber).padStart(3, "0")}`;

    // Crear orden principal
    const createdOrder = await base(TABLE_ORDERS).create([
      {
        fields: {
          OrderID: shortId,
          OrderNumber: nextNumber,
          Name: orderData.customer_name,
          Phone: orderData.customer_phone,
          OrderType: orderData.order_type,
          Address: orderData.address || "",
          ScheduleDate: orderData.schedule_date || "",
          ScheduleTime: orderData.schedule_time || "",
          Subtotal: orderData.subtotal,
          Discount: orderData.discount,
          Total: orderData.total,
          Coupon: orderData.coupon_code || "",
          Notes: orderData.notes || "",
          Status: "Received",
        },
      },
    ]);

    console.log(`✅ Order created: ${shortId}`);

    // Crear los ítems relacionados (duplicando según qty)
    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      const orderItems: any[] = [];

      for (const item of orderData.items) {
        const qty = item.qty || 1;

        for (let i = 0; i < qty; i++) {
          orderItems.push({
            fields: {
              Order: shortId,
              ProductName: item.name,
              Option: item.option || "",
              Price: item.price || 0,
              AddOns: Array.isArray(item.addons)
                ? item.addons
                    .map(
                      (a: any) =>
                        `${a?.name || "Unnamed"} ($${(a?.price || 0).toFixed(2)})`
                    )
                    .join(", ")
                : "",
            },
          });
        }
      }

      while (orderItems.length > 0) {
        const batch = orderItems.splice(0, 10);
        await base(TABLE_ORDERITEMS).create(batch);
      }

      console.log("✅ OrderItems saved successfully");
    } else {
      console.warn("⚠️ No order items found in request");
    }

    // Respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId: shortId }),
    };
  } catch (err) {
    console.error("❌ Error creating order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to create order" }),
    };
  }
};
