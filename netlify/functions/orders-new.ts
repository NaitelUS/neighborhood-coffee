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
    console.log("✅ Function invoked");

    const data = JSON.parse(event.body || "{}");
    console.log("📦 Payload received:", JSON.stringify(data));

    const { customer, items, total, coupon } = data;

    const orderRecord = await base("Orders").create({
      fields: {
        customerName: customer.name,
        customerEmail: customer.email,
        total,
        coupon: coupon || "",
      },
    });

    console.log("✅ Order created:", orderRecord.id);

    const orderId = orderRecord.id;

    await Promise.all(
      items.map(async (item: any) => {
        console.log("🛒 Creating OrderItem with:", JSON.stringify(item));

        await base("OrderItems").create({
          fields: {
            order: [orderId],
            product: item.name,
            option: item.option,
            addons: item.addons?.map((a: any) => a.name).join(", "),
            qty: item.qty || 1,
            price: item.price,
          },
        });

        console.log("✅ OrderItem created for:", item.name);
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId }),
    };
  } catch (error) {
    console.error("❌ Error in orders-new.ts:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create order" }),
    };
  }
};

export { handler };
