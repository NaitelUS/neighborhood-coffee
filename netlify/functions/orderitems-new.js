const { getAirtableClient } = require("../lib/airtableClient");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { orderID, items } = JSON.parse(event.body || "{}");

    if (!orderID || !Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing or invalid orderID/items" }) };
    }

    const base = getAirtableClient();
    const table = base("OrderItems");

    let count = 0;
    for (const it of items) {
      await table.create([
        {
          fields: {
            ProductName: it.name || "",
            Option: it.option || "",
            Price: Number(it.price) || 0,
            Qty: Number(it.qty) || 1,
            AddOns: it.addons || "",
            OrderID: orderID, // clave por texto
          },
        },
      ]);
      count++;
    }

    return { statusCode: 200, body: JSON.stringify({ message: "Order items created", count }) };
  } catch (error) {
    console.error("orderitems-new error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error", details: error.message }) };
  }
};
