import { Handler } from "@netlify/functions";
import { base } from "../lib/airtableClient";

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const {
      customerInfo,
      schedule,
      cartItems,
      subtotal,
      discount,
      total,
      appliedCoupon,
    } = data;

    if (!customerInfo || !cartItems?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // 🧾 Crear orden principal
    const orderRecord = await base(TABLE_ORDERS).create([
      {
        fields: {
          "Customer Name": customerInfo.name,
          Phone: customerInfo.phone,
          Method: customerInfo.method,
          Address: customerInfo.address || "",
          DateTime: schedule,
          Subtotal: subtotal,
          Discount: discount,
          Total: total,
          Coupon: appliedCoupon || "",
        },
      },
    ]);

    const orderId = orderRecord[0].id;

    // ☕ Crear items vinculados
    const orderItems = cartItems.map((item: any) => ({
      fields: {
        Product: item.name,
        Price: item.price,
        AddOns:
          item.addons?.map((a: any) => `${a.name} (+$${a.price.toFixed(2)})`).join(", ") || "",
        Order: [orderId],
      },
    }));

    await base(TABLE_ORDERITEMS).create(orderItems);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        orderId,
      }),
    };
  } catch (error: any) {
    console.error("❌ Error saving order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
