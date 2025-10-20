const { getAirtableClient } = require("../lib/airtableClient");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const { id, orderID, status } = JSON.parse(event.body || "{}");
    if (!status || (!id && !orderID)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing id/orderID or status" }) };
    }

    const base = getAirtableClient();
    const ordersTable = base("Orders");

    // Resolver record id si viene orderID
    let recordId = id;
    if (!recordId && orderID) {
      const found = await ordersTable
        .select({ filterByFormula: `{OrderID} = '${orderID}'`, maxRecords: 1 })
        .firstPage();
      if (!found.length) {
        return { statusCode: 404, body: JSON.stringify({ error: "Order not found" }) };
      }
      recordId = found[0].id;
    }

    const updated = await ordersTable.update([
      { id: recordId, fields: { Status: status } },
    ]);

    return { statusCode: 200, body: JSON.stringify({ success: true, id: updated[0].id, status }) };
  } catch (error) {
    console.error("orders-update error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error", details: error.message }) };
  }
};
