import { getAirtableClient } from "../lib/airtableClient";

exports.handler = async (event) => {
  try {
    const { id } = event.queryStringParameters || {};
    const base = getAirtableClient();

    const ordersTable = base("Orders");
    const itemsTable = base("OrderItems");

    if (id) {
      // Buscar la orden por ID o por OrderID
      const records = await ordersTable
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
      const orderID = fields.OrderID || "";

      // 🔍 Buscar los items asociados a este OrderID
      const itemRecords = await itemsTable
        .select({
          filterByFormula: `{Order} = '${orderID}'`,
        })
        .firstPage();

      const orderItems = itemRecords.map((r) => ({
        name: r.fields.ProductName || "",
        option: r.fields.Option || "",
        qty: r.fields.Qty || 1,
        price: Number(r.fields.Price) || 0,
        addons: r.fields.AddOns || "",
      }));

      // ✅ Armar el JSON final
      const normalized = {
        id: record.id,
        orderID: orderID,
        name: fields.Name || "",
        subtotal: Number(fields.Subtotal) || 0,
        discount: Number(fields.Discount) || 0,
        total: Number(fields.Total) || 0,
        coupon: fields.Coupon || "",
        status: fields.Status || "",
        schedule_date: fields.ScheduleDate || "",
        schedule_time: fields.ScheduleTime || "",
        order_type: fields.OrderType || "",
        items: orderItems, // 👈 recibo completo
      };

      return {
        statusCode: 200,
        body: JSON.stringify(normalized),
      };
    }

    // Si no hay id → listado general
    const records = await ordersTable
      .select({ sort: [{ field: "CreatedAt", direction: "desc" }] })
      .firstPage();

    const allOrders = records.map((record) => ({
      id: record.id,
      orderID: record.fields.OrderID || "",
      name: record.fields.Name || "",
      total: Number(record.fields.Total) || 0,
      status: record.fields.Status || "",
      schedule_date: record.fields.ScheduleDate || "",
      schedule_time: record.fields.ScheduleTime || "",
      order_type: record.fields.OrderType || "",
      coupon: record.fields.Coupon || "",
    }));

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
