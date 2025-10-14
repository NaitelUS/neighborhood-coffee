import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const { customer, items, total, coupon } = data;

    // 1. Crear Order
    const orderRecord = await base("Orders").create({
      fields: {
        customerName: customer.name,
        customerEmail: customer.email,
        total,
        coupon: coupon || "",
      },
    });

    const orderId = orderRecord.id;

    // 2. Crear OrderItems
    await Promise.all(
      items.map(async (item: any) => {
        await base("OrderItems").create({
          fields: {
            order: [orderId],
            product: item.name,
            option: item.option,
            addons: item.addons?.map((a: any) => a.name).join(", "),
            qty: item.qty || 1, // ✅ Cantidad enviada correctamente
            price: item.price,
          },
        });
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId }),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create order" }),
    };
  }
};

export { handler };
