import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  try {
    // 🧩 Si viene ?id=TNC-###, buscamos solo esa orden
    const params = event.queryStringParameters || {};
    const orderId = params.id;

    if (orderId) {
      console.log(`🔍 Fetching order by ID: ${orderId}`);

      // Buscar la orden por OrderID
      const orderRecords = await base(TABLE_ORDERS)
        .select({
          filterByFormula: `{OrderID} = '${orderId}'`,
          maxRecords: 1,
        })
        .firstPage();

      if (orderRecords.length === 0) {
        console.warn("⚠️ Order not found:", orderId);
        return {
          statusCode: 404,
          body: JSON.stringify({ success: false, message: "Order not found" }),
        };
      }

      const order = orderRecords[0];
      const orderFields = order.fields;

      // Buscar los productos de la orden en OrderItems
      const items = await base(TABLE_ORDERITEMS)
        .select({
          filterByFormula: `{Order} = '${orderId}'`,
        })
        .all();

      const orderItems = items.map((i) => ({
        ProductName: i.get("ProductName") || "",
        Option: i.get("Option") || "",
        AddOns: i.get("AddOns") || "",
        Price: i.get("Price") || 0,
        Qty: i.get("Qty") || 1,
      }));

      const fullOrder = {
        id: order.id,
        OrderID: orderFields["OrderID"],
        OrderNumber: orderFields["OrderNumber"],
        Name: orderFields["Name"],
        Phone: orderFields["Phone"],
        OrderType: orderFields["OrderType"],
        Address: orderFields["Address"],
        ScheduleDate: orderFields["ScheduleDate"],
        ScheduleTime: orderFields["ScheduleTime"],
        Subtotal: orderFields["Subtotal"],
        Discount: orderFields["Discount"],
        Total: orderFields["Total"],
        Coupon: orderFields["Coupon"],
        Notes: orderFields["Notes"],
        Status: orderFields["Status"],
        CreatedAt: orderFields["CreatedAt"],
        Items: orderItems,
      };

      return {
        statusCode: 200,
        body: JSON.stringify(fullOrder), // ✅ devolvemos objeto, no array
      };
    }

    // 🧾 Si no hay ?id=, devolvemos todas las órdenes
    const records = await base(TABLE_ORDERS)
      .select({
        sort: [{ field: "OrderNumber", direction: "desc" }],
        view: "Grid view",
      })
      .all();

    const allOrders = records.map((r) => ({
      id: r.id,
      OrderID: r.get("OrderID"),
      OrderNumber: r.get("OrderNumber"),
      Name: r.get("Name"),
      Phone: r.get("Phone"),
      OrderType: r.get("OrderType"),
      Address: r.get("Address"),
      ScheduleDate: r.get("ScheduleDate"),
      ScheduleTime: r.get("ScheduleTime"),
      Subtotal: r.get("Subtotal"),
      Discount: r.get("Discount"),
      Total: r.get("Total"),
      Coupon: r.get("Coupon"),
      Notes: r.get("Notes"),
      Status: r.get("Status"),
      CreatedAt: r.get("CreatedAt"),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(allOrders),
    };
  } catch (err: any) {
    console.error("❌ Error fetching orders:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message || "Failed to fetch orders",
      }),
    };
  }
};
