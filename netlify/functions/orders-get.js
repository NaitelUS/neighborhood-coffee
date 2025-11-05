import Airtable from "airtable";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ORDERS } = process.env;
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
const ordersTable = base(AIRTABLE_TABLE_ORDERS);

export const handler = async (event) => {
  try {
    // Si viene ID, devolver solo esa orden
    const id = event.queryStringParameters?.id;
    if (id) {
      const record = await ordersTable.find(id);
      const f = record.fields || {};

      return {
        statusCode: 200,
        body: JSON.stringify({
          id: record.id,
          Customer: f.Name || "",
          OrderID: f.OrderID || "",
          Total: Number(f.Total) || 0,
          Status: f.Status || "Received",
          ScheduleDate: f.ScheduleDate || "",
          ScheduleTime: f.ScheduleTime || "",
          OrderType: f.OrderType || "",
          Coupon: f.Coupon || "",
          Timestamp: f.CreatedAt || f.Date || record._rawJson.createdTime || "",
        }),
      };
    }

    // Si no hay ID, devolver la lista completa (para /admin/orders)
    const list = await ordersTable
      .select({ sort: [{ field: "CreatedAt", direction: "desc" }] })
      .firstPage();

    const all = list.map((rec) => {
      const f = rec.fields || {};
      return {
        id: rec.id,
        Customer: f.Name || "",
        OrderID: f.OrderID || "",
        Total: Number(f.Total) || 0,
        Status: f.Status || "Received",
        ScheduleDate: f.ScheduleDate || "",
        ScheduleTime: f.ScheduleTime || "",
        OrderType: f.OrderType || "",
        Coupon: f.Coupon || "",
        Timestamp: f.CreatedAt || f.Date || rec._rawJson.createdTime || "",
      };
    });

    return { statusCode: 200, body: JSON.stringify(all) };
  } catch (err) {
    console.error("Error in orders-get.js:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch orders" }),
    };
  }
};
