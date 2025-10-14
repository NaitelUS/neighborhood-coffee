import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDER_ITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    const data = JSON.parse(event.body!);

    // Obtener el número de orden más reciente
    const existingOrders = await base(TABLE_ORDERS)
      .select({
        sort: [{ field: "OrderID", direction: "desc" }],
        maxRecords: 1,
      })
      .firstPage();

    let nextOrderId = "TNC-001";
    if (existingOrders.length > 0) {
      const lastOrder = existingOrders[0].get("OrderID") as string;
      const number = parseInt(lastOrder.replace("TNC-", ""), 10) + 1;
      nextOrderId = `TNC-${String(number).padStart(3, "0")}`;
    }

    // Crear registro en Orders
    const orderRecord = await base(TABLE_ORDERS).create({
      OrderID: nextOrderId,
      Name: data.customer_name,
      Phone: data.customer_phone,
      Address: data.address,
      Type: data.order_type,
      ScheduleDate: data.schedule_date,
      ScheduleTime: data.schedule_time,
      Subtotal: data.subtotal,
      Discount: data.discount,
      Total: data.total,
      Coupon: data.coupon_code,
      Notes: data.notes,
    });

    const orderId = orderRecord.id;

    // Crear registros en OrderItems
    for (const item of data.items) {
      const itemName = item.name || "";
      const itemOption = item.option || "";
      const itemPrice = item.price || 0;
      const itemQty = item.qty || 1;

      await base(TABLE_ORDER_ITEMS).create({
        Product: itemName,
        Option: itemOption,
        Price: itemPrice,
        Qty: itemQty,
        Order: [orderId],
        Addons: item.addons?.map((a: any) => a.name).join(", "),
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ orderId: nextOrderId }),
    };
  } catch (error: any) {
    console.error("❌ Error in orders-new.ts:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
