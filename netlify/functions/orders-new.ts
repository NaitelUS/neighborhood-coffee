import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY!,
}).base(process.env.AIRTABLE_BASE_ID!);

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    console.log("📦 Payload received:", data);

    // Obtener último OrderNumber
    const records = await base("Orders")
      .select({ sort: [{ field: "OrderNumber", direction: "desc" }], maxRecords: 1 })
      .firstPage();

    const lastOrderNumber = records.length > 0 ? records[0].get("OrderNumber") as number : 0;
    const newOrderNumber = lastOrderNumber + 1;
    const orderId = `TNC-${String(newOrderNumber).padStart(3, "0")}`;

    // Crear registro en Orders
    const order = await base("Orders").create({
      Name: data.customer_name,
      Phone: data.customer_phone,
      Address: data.address,
      OrderType: data.order_type,
      ScheduleDate: data.schedule_date,
      ScheduleTime: data.schedule_time,
      Subtotal: data.subtotal,
      Discount: data.discount,
      Total: data.total,
      Coupon: data.coupon_code,
      Notes: data.notes,
      OrderID: orderId,
      OrderNumber: newOrderNumber,
      CreatedAt: new Date().toISOString(),
    });

    const orderAirtableId = order.id;
    console.log("✅ Order created:", orderAirtableId, orderId);

    // Crear los OrderItems
    const items = data.items || [];
    for (const item of items) {
      await base("OrderItems").create({
        ProductName: item.name,
        Option: item.option,
        Price: item.price,
        AddOns: (item.addons || [])
          .map((a: any) => `${a.name} (+$${a.price})`)
          .join(", "),
        Qty: item.qty || 1,
        Order: [orderAirtableId], // referencia vinculada
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ orderId: orderAirtableId }),
    };
  } catch (err) {
    console.error("❌ Error in orders-new.ts:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create order" }),
    };
  }
};

export { handler };
