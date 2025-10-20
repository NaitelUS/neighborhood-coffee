const { getAirtableClient } = require("../lib/airtableClient");

exports.handler = async (event) => {
  try {
    const base = getAirtableClient();
    const ordersTable = base("Orders");
    const itemsTable = base("OrderItems");
    const qs = event.queryStringParameters || {};
    const id = qs.id;

    // Si piden una sola orden (por record id o por OrderID)
    if (id) {
      const records = await ordersTable
        .select({
          filterByFormula: `OR(RECORD_ID() = '${id}', {OrderID} = '${id}')`,
          maxRecords: 1,
        })
        .firstPage();

      if (!records || records.length === 0) {
        return { statusCode: 404, body: JSON.stringify({ error: "Order not found" }) };
      }

      const rec = records[0];
      const f = rec.fields || {};
      const orderID = f.OrderID || "";

      // Trae items por OrderID (texto)
      const itemRecords = await itemsTable
        .select({ filterByFormula: `{OrderID} = '${orderID}'` })
        .firstPage();

      const items = itemRecords.map((ir) => {
        const product = ir.fields.ProductName || "";
        const option = ir.fields.Option || "";

        // Evita duplicar cuando ProductName ya contiene Option (ej. Americano (Hot))
        const displayName =
          option &&
          product.toLowerCase().includes(option.toLowerCase())
            ? product
            : option
            ? `${product} (${option})`
            : product;

        return {
          name: displayName.trim(),
          option,
          qty: Number(ir.fields.Qty) || 1,
          price: Number(ir.fields.Price) || 0,
          addons: Array.isArray(ir.fields.AddOns)
            ? ir.fields.AddOns
            : ir.fields.AddOns
            ? [ir.fields.AddOns]
            : [],
        };
      });

      const normalized = {
        id: rec.id,
        orderID,
        orderNumber: f.OrderNumber || "",
        name: f.Name || "",
        phone: f.Phone || "",
        address: f.Address || "",
        order_type: f.OrderType || "",
        schedule_date: f.ScheduleDate || "",
        schedule_time: f.ScheduleTime || "",
        subtotal: Number(f.Subtotal) || 0,
        discount: Number(f.Discount) || 0,
        total: Number(f.Total) || 0,
        coupon: f.Coupon || "",
        status: f.Status || "",
        notes: f.Notes || "",
        createdAt: f.CreatedAt || f.Date || "",
        items,
      };

      return { statusCode: 200, body: JSON.stringify(normalized) };
    }

    // Si no hay id, lista general para /admin/orders
    const list = await ordersTable
      .select({ sort: [{ field: "CreatedAt", direction: "desc" }] })
      .firstPage();

    const all = list.map((rec) => {
      const f = rec.fields || {};
      return {
        id: rec.id,
        orderID: f.OrderID || "",
        name: f.Name || "",
        total: Number(f.Total) || 0,
        status: f.Status || "",
        schedule_date: f.ScheduleDate || "",
        schedule_time: f.ScheduleTime || "",
        order_type: f.OrderType || "",
        coupon: f.Coupon || "",
      };
    });

    return { statusCode: 200, body: JSON.stringify(all) };
  } catch (error) {
    console.error("orders-get error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};
