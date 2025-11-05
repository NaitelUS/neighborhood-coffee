import Airtable from "airtable";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ORDERS } = process.env;
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
const ordersTable = base(AIRTABLE_TABLE_ORDERS);

export const handler = async (event) => {
  try {
    const id = event.queryStringParameters?.id;

    // 🔹 Si se envía un ID específico → devolver solo esa orden
    if (id) {
      const record = await ordersTable.find(id);
      const f = record.fields || {};

      return {
        statusCode: 200,
        body: JSON.stringify({
          id: record.id,
          Customer: f.Name || "",
          Phone: f.Phone || "",
          Address: f.Address || "",
          OrderType: f.OrderType || "",
          ScheduleDate: f.ScheduleDate || "",
          ScheduleTime: f.ScheduleTime || "",
          Subtotal: Number(f.Subtotal) || 0,
          Discount: Number(f.Discount) || 0,
          Total: Number(f.Total) || 0,
          Coupon: f.Coupon || "",
          Status: f.Status || "Received",
          CreatedTime: f.CreatedTime || "",
          Notes: f.Notes || "",
          OrderID: f.OrderID || "",
          OrderNumber: f.OrderNumber || "",
          Date: f.Date || "",
        }),
      };
    }

    // 🔹 Si no se envía ID → devolver todas las órdenes
    const list = await ordersTable
      .select({ sort: [{ field: "Date", direction: "desc" }] })
      .firstPage();

    const all = list.map((rec) => {
      const f = rec.fields || {};
      return {
        id: rec.id,
        Customer: f.Name || "",
        Phone: f.Phone || "",
        Address: f.Address || "",
        OrderType: f.OrderType || "",
        ScheduleDate: f.ScheduleDate || "",
        ScheduleTime: f.ScheduleTime || "",
        Subtotal: Number(f.Subtotal) || 0,
        Discount: Number(f.Discount) || 0,
        Total: Number(f.Total) || 0,
        Coupon: f.Coupon || "",
        Status: f.Status || "Received",
        CreatedTime: f.CreatedTime || "",
        Notes: f.Notes || "",
        OrderID: f.OrderID || "",
        OrderNumber: f.OrderNumber || "",
        Date: f.Date || "",
      };
    });

    return { statusCode: 200, body: JSON.stringify(all) };
  } catch (err) {
    console.error("❌ Error in orders-get.js:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch orders",
        details: err.message || "Unknown error",
      }),
    };
  }
};
