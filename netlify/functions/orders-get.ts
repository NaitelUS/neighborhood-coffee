import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  try {
    const id = event.queryStringParameters?.id;

    if (id) {
      // Buscar una orden específica
      const records = await base(TABLE_ORDERS)
        .select({ filterByFormula: `{OrderID} = '${id}'`, maxRecords: 1 })
        .firstPage();

      if (records.length === 0)
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Order not found" }),
        };

      const record = records[0];
      const orderId = record.fields["OrderID"];

      // Buscar los items relacionados
      const items = await base(TABLE_ORDERITEMS)
        .select({
          filterByFormula: `{Order} = '${orderId}'`,
        })
        .all();

      const orderItems = items.map((i) => ({
        product_name: i.fields["ProductName"],
        option: i.fields["Option"],
        price: i.fields["Price"],
        addons: i.fields["AddOns"],
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({
          id: orderId,
          name: record.fields["Name"],
          phone: record.fields["Phone"],
          order_type: record.fields["OrderType"],
          address: record.fields["Address"],
          total: record.fields["Total"],
          status: record.fields["Status"],
          schedule_date: record.fields["ScheduleDate"],
          schedule_time: record.fields["ScheduleTime"],
          notes: record.fields["Notes"],
          items: orderItems,
        }),
      };
    }

    // Si no hay ID → devolver todas las órdenes
    const records = await base(TABLE_ORDERS)
      .select({ sort: [{ field: "CreatedTime", direction: "desc" }] })
      .all();

    const orders = records.map((r) => ({
      id: r.fields["OrderID"],
      name: r.fields["Name"],
      phone: r.fields["Phone"],
      order_type: r.fields["OrderType"],
      address: r.fields["Address"],
      total: r.fields["Total"],
      status: r.fields["Status"],
      schedule_date: r.fields["ScheduleDate"],
      schedule_time: r.fields["ScheduleTime"],
      notes: r.fields["Notes"],
      created_at: r.fields["CreatedTime"],
    }));

    return { statusCode: 200, body: JSON.stringify(orders) };
  } catch (err) {
    console.error("Error in orders-get:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch orders" }),
    };
  }
};
