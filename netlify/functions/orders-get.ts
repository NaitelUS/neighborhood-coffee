import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

exports.handler = async () => {
  try {
    const orders = await base(process.env.AIRTABLE_TABLE_ORDERS!)
      .select({ view: "Grid view" })
      .all();

    const results = [];

    for (const record of orders) {
      const orderId = record.id;

      // Obtener ítems relacionados
      const linkedItems = await base(process.env.AIRTABLE_TABLE_ORDERITEMS!)
        .select({
          filterByFormula: `{Order} = '${orderId}'`,
        })
        .all();

      const items = linkedItems.map((i) => ({
        product_name: i.get("ProductName"),
        option: i.get("Option"),
        addons: i.get("AddOns"),
        price: i.get("Price"),
      }));

      results.push({
        id: orderId,
        order_number: record.get("OrderNumber") || "",
        name: record.get("Name"),
        phone: record.get("Phone"),
        address: record.get("Address"),
        order_type: record.get("OrderType"),
        schedule_date: record.get("ScheduleDate"),
        schedule_time: record.get("ScheduleTime"),
        notes: record.get("Notes"),
        status: record.get("Status"),
        total: record.get("Total"),
        items,
      });
    }

    return { statusCode: 200, body: JSON.stringify(results) };
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return { statusCode: 500, body: "Error fetching orders" };
  }
};
