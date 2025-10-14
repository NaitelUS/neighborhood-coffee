import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const handler: Handler = async (event) => {
  const id = event.queryStringParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing order ID" }),
    };
  }

  try {
    const orderRecord = await base(process.env.AIRTABLE_TABLE_ORDERS as string).find(id);
    const orderItems = await base(process.env.AIRTABLE_TABLE_ORDERITEMS as string)
      .select({
        filterByFormula: `{Order} = '${orderRecord.id}'`,
      })
      .all();

    const items = orderItems.map((item) => ({
      name: item.get("Product") as string,
      option: item.get("Option") as string,
      price: item.get("Price") as number,
      qty: item.get("Qty") as number,
      addons: item.get("AddOns") as string,
    }));

    const orderData = {
      id: orderRecord.id,
      OrderID: orderRecord.get("OrderID"), // ✅ añadido para ThankYou
      name: orderRecord.get("Customer Name"),
      phone: orderRecord.get("Phone"),
      order_type: orderRecord.get("Order Type"),
      address: orderRecord.get("Address"),
      schedule_date: orderRecord.get("Schedule Date"),
      schedule_time: orderRecord.get("Schedule Time"),
      notes: orderRecord.get("Notes"),
      total: orderRecord.get("Total"),
      subtotal: orderRecord.get("Subtotal"),
      discount: orderRecord.get("Discount"),
      items,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(orderData),
    };
  } catch (err) {
    console.error("❌ Error in orders-get:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch order" }),
    };
  }
};

export { handler };
