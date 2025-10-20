const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

exports.handler = async (event) => {
  try {
    const { id } = event.queryStringParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing order ID" }),
      };
    }

    // Tabla de órdenes
    const ordersTable = base(process.env.AIRTABLE_TABLE_ORDERS);
    // Tabla de ítems
    const itemsTable = base(process.env.AIRTABLE_TABLE_ORDERITEMS);

    // Buscar la orden
    const orderRecords = await ordersTable
      .select({ filterByFormula: `{OrderID} = '${id}'` })
      .firstPage();

    if (!orderRecords.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Order not found" }),
      };
    }

    const order = orderRecords[0].fields;

    // Buscar ítems con el mismo OrderID
    const itemRecords = await itemsTable
      .select({ filterByFormula: `{OrderID} = '${id}'` })
      .all();

    const items = itemRecords.map((r) => ({
      name: r.fields["Name"] || "",
      option: r.fields["Option"] || "",
      qty: r.fields["Qty"] || 1,
      addons: r.fields["AddOns"] || [],
      price: r.fields["Price"] || 0,
    }));

    // Combinar orden + items
    const fullOrder = {
      id: orderRecords[0].id,
      orderID: order["OrderID"],
      name: order["Name"],
      phone: order["Phone"],
      address: order["Address"] || "",
      order_type: order["OrderType"] || order["order_type"] || "",
      status: order["Status"] || "",
      total: order["Total"] || 0,
      subtotal: order["Subtotal"] || 0,
      discount: order["Discount"] || 0,
      coupon: order["Coupon"] || "",
      schedule_date: order["ScheduleDate"] || "",
      schedule_time: order["ScheduleTime"] || "",
      items,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(fullOrder),
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: error.message }),
    };
  }
};
