import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = "Orders";
const TABLE_ORDERITEMS = "OrderItems";

export const handler: Handler = async (event) => {
  try {
    const orderId = event.queryStringParameters?.id;
    if (!orderId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing order ID" }),
      };
    }

    // 🔍 Buscar la orden por OrderID (TNC-###)
    const orderRecords = await base(TABLE_ORDERS)
      .select({
        filterByFormula: `{OrderID} = '${orderId}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (orderRecords.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Order not found" }),
      };
    }

    const order = orderRecords[0].fields;

    // 📦 Buscar los items relacionados (OrderItems)
    const orderItems = await base(TABLE_ORDERITEMS)
      .select({
        filterByFormula: `{Order} = '${orderId}'`,
      })
      .all();

    const items = orderItems.map((item) => ({
      product_name: item.fields["ProductName"] || "",
      option: item.fields["Option"] || "",
      addons: item.fields["AddOns"] || "",
      price: item.fields["Price"] || 0,
      qty: item.fields["Qty"] || 1,
    }));

    // 🧾 Armar respuesta estructurada
    const result = {
      id: orderRecords[0].id,
      orderId: order["OrderID"],
      name: order["Name"],
      phone: order["Phone"],
      order_type: order["OrderType"],
      address: order["Address"],
      total: order["Total"] || 0,
      subtotal: order["Subtotal"] || 0,
      discount: order["Discount"] || 0,
      coupon: order["Coupon"] || "",
      schedule_date: order["ScheduleDate"] || "",
      schedule_time: order["ScheduleTime"] || "",
      notes: order["Notes"] || "",
      items,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch order" }),
    };
  }
};
