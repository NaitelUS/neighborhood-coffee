import { getAirtableClient } from "../lib/airtableClient";

exports.handler = async (event) => {
  try {
    const { id } = event.queryStringParameters || {};
    const base = getAirtableClient();
    const table = base("Orders");

    // 🔍 Si se busca una orden específica (por ID o por OrderID)
    if (id) {
      const records = await table
        .select({
          filterByFormula: `OR(RECORD_ID() = '${id}', {OrderID} = '${id}')`,
          maxRecords: 1,
        })
        .firstPage();

      if (!records || records.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Order not found" }),
        };
      }

      const record = records[0];
      const fields = record.fields || {};

      // ✅ Normaliza todos los campos principales
      const normalized = {
        id: record.id,
        orderID: fields.OrderID || "",
        orderNumber: fields.OrderNumber || "",
        name: fields.Name || "",
        phone: fields.Phone || "",
        address: fields.Address || "",
        order_type: fields.OrderType || "",
        schedule_date: fields.ScheduleDate || "",
        schedule_time: fields.ScheduleTime || "",
        subtotal: Number(fields.Subtotal) || 0,
        discount: Number(fields.Discount) || 0,
        total: Number(fields.Total) || 0,
        coupon: fields.Coupon || "", // ✅ cupón usado
        status: fields.Status || "",
        notes: fields.Notes || "",
        createdAt: fields.CreatedAt || fields.Date || "",
      };

      return {
        statusCode: 200,
        body: JSON.stringify(normalized),
      };
    }

    // 🔁 Si no hay ID, devuelve todas las órdenes (para /admin/orders)
    const records = await table
      .select({ sort: [{ field: "CreatedAt", direction: "desc" }] })
      .firstPage();

    const allOrders = records.map((record) => {
      const fields = record.fields || {};
      return {
        id: record.id,
        orderID: fields.OrderID || "",
        name: fields.Name || "",
        total: Number(fields.Total) || 0,
        status: fields.Status || "",
        schedule_date: fields.ScheduleDate || "",
        schedule_time: fields.ScheduleTime || "",
        order_type: fields.OrderType || "",
        coupon: fields.Coupon || "", // ✅ cupón mostrado también en panel admin
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(allOrders),
    };
  } catch (error) {
    console.error("Error in orders-get:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: error.message }),
    };
  }
};
