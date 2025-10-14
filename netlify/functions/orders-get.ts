import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! }).base(
  process.env.AIRTABLE_BASE_ID!
);

const handler: Handler = async (event) => {
  const { id } = event.queryStringParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing order ID" }),
    };
  }

  try {
    // Buscar la orden por record ID
    const order = await base("Orders").find(id);

    // Buscar los items relacionados (OrderItems con campo Order = [id])
    const items = await base("OrderItems")
      .select({
        filterByFormula: `FIND("${id}", ARRAYJOIN(Order))`,
      })
      .all();

    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.get("ProductName") || "",
      option: item.get("Option") || "",
      price: item.get("Price") || 0,
      qty: item.get("Qty") || 1,
      addons: item.get("AddOns") || "",
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: order.id,
        name: order.get("Name"),
        phone: order.get("Phone"),
        address: order.get("Address"),
        order_type: order.get("OrderType"),
        schedule_date: order.get("ScheduleDate"),
        schedule_time: order.get("ScheduleTime"),
        subtotal: order.get("Subtotal"),
        discount: order.get("Discount"),
        total: order.get("Total"),
        coupon_code: order.get("Coupon"),
        notes: order.get("Notes"),
        orderId: order.get("OrderID"),
        order_number: order.get("OrderNumber"),
        created_at: order.get("CreatedAt"),
        items: formattedItems,
      }),
    };
  } catch (error) {
    console.error("❌ orders-get error:", error);
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Order not found" }),
    };
  }
};

export { handler };
