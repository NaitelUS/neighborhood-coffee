import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const {
      customer_name,
      customer_phone,
      method,
      address,
      schedule,
      subtotal,
      discount_value,
      coupon,
      total,
      status,
      items,
    } = data;

    if (!customer_name || !customer_phone || !items?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const base = getAirtableClient();

    const formattedItems = items
      .map((item: any) => {
        let desc = `${item.name}`;
        if (item.option) desc += ` (${item.option})`;
        if (item.addons) desc += ` | Add-ons: ${item.addons}`;
        return desc;
      })
      .join("\n");

    const created = await base(TABLE_ORDERS).create([
      {
        fields: {
          customer_name,
          customer_phone,
          method,
          address: address || "",
          schedule,
          subtotal,
          discount_value,
          coupon,
          total,
          status: status || "Received",
          items: formattedItems,
        },
      },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order created successfully",
        id: created[0].id,
      }),
    };
  } catch (err) {
    console.error("❌ Error creating order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", error: String(err) }),
    };
  }
};
