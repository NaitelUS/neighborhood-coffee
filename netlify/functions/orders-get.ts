import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  try {
    const { id } = event.queryStringParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing order ID." }),
      };
    }

    console.log(`📦 Fetching order: ${id}`);

    // 🧾 Buscar la orden principal
    const orderRecords = await base(TABLE_ORDERS)
      .select({
        filterByFormula: `{OrderID} = '${id}'`,
        maxRecords: 1,
      })
      .all();

    if (orderRecords.length === 0) {
      console.warn("⚠️ Order not found:", id);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Order not found." }),
      };
    }

    const order = orderRecords[0].fields;

    // 📦 Buscar todos los OrderItems relacionados
    const itemRecords = await base(TABLE_ORDERITEMS)
      .select({
        filterByFormula: `{Order} = '${id}'`,
        maxRecords: 50,
      })
      .all();

    const items = itemRecords.map((rec) => ({
      ProductName: rec.fields["ProductName"] || "",
      Option: rec.fields["Option"] || "",
      AddOns: rec.fields["AddOns"] || "",
      Price: rec.fields["Price"] || 0,
      Qty: rec.fields["Qty"] || 1,
    }));

    // 🧩 Armar estructura completa
    const fullOrder = {
      OrderID: order["OrderID"],
      Name: order["Name"],
      Phone: order["Phone"] || "",
      OrderType: order["OrderType"] || "",
      Address: order["Address"] || "",
      ScheduleDate: order["ScheduleDate"] || "",
      ScheduleTime: order["ScheduleTime"] || "",
      Subtotal: order["Subtotal"] || 0,
      DiscountRate: order["DiscountRate"] || 0,
      Total: order["Total"] || 0,
      Coupon: order["Coupon"] || "",
      Status: order["Status"] || "",
      Notes: order["Notes"] || "",
      CreatedAt: order["CreatedAt"] || "",
      items,
    };

    console.log(`✅ Order ${id} loaded with ${items.length} items`);

    return {
      statusCode: 200,
      body: JSON.stringify([fullOrder]),
    };
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error fetching order." }),
    };
  }
};
