import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS!;
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS!;

export const handler: Handler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");

    // ✅ Crear la orden principal
    const orderRecord = await base(TABLE_ORDERS).create([
      {
        fields: {
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
          Status: data.status || "Received",
        },
      },
    ]);

    const orderId = orderRecord[0].id;

    // ✅ Crear los items asociados
    if (data.items && Array.isArray(data.items)) {
   await base(TABLE_ORDERITEMS).create(
  orderData.items.map((item) => ({
    fields: {
      Order: [orderId],
      ProductName: item.name,
      Option: item.option,
      Price: item.price,
      AddOns: item.addons || "", // ✅ guarda AddOns en texto plano
    },
  }))
);

    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId }),
    };
  } catch (err) {
    console.error("❌ Error creating order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create order" }),
    };
  }
};
