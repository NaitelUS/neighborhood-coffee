import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const {
      name,
      phone,
      address,
      order_type,
      schedule_date,
      schedule_time,
      total,
      notes,
      items,
    } = body;

    // 1️⃣ Obtener el siguiente número consecutivo
    const existingOrders = await base(process.env.AIRTABLE_TABLE_ORDERS!)
      .select({
        fields: ["OrderNumber"],
        sort: [{ field: "CreatedAt", direction: "desc" }],
        maxRecords: 1,
      })
      .firstPage();

    let nextNumber = 1;
    if (existingOrders.length > 0) {
      const lastOrderNumber = existingOrders[0].get("OrderNumber");
      if (lastOrderNumber && typeof lastOrderNumber === "string") {
        const num = parseInt(lastOrderNumber.replace("TNC-", ""), 10);
        if (!isNaN(num)) nextNumber = num + 1;
      }
    }

    const formattedOrderNumber = `TNC-${String(nextNumber).padStart(3, "0")}`;
    const createdAt = new Date().toISOString();

    // 2️⃣ Crear la orden principal
    const newOrder = await base(process.env.AIRTABLE_TABLE_ORDERS!).create([
      {
        fields: {
          Name: name,
          Phone: phone,
          Address: address || "",
          OrderType: order_type,
          ScheduleDate: schedule_date,
          ScheduleTime: schedule_time,
          Total: total,
          Notes: notes || "",
          Status: "Received",
          OrderNumber: formattedOrderNumber,
          CreatedAt: createdAt, // 🔹 Aquí se llena explícitamente
        },
      },
    ]);

    const orderId = newOrder[0].id;
    console.log(`✅ New order created: ${formattedOrderNumber} (${orderId})`);

    // 3️⃣ Crear los items relacionados
    if (Array.isArray(items) && items.length > 0) {
      const orderItems = items.map((item) => ({
        fields: {
          Order: [orderId],
          ProductName: item.product_name,
          Option: item.option || "",
          AddOns: item.addons || "",
          Price: item.price || 0,
        },
      }));

      await base(process.env.AIRTABLE_TABLE_ORDERITEMS!).create(orderItems);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        order_id: orderId,
        order_number: formattedOrderNumber,
      }),
    };
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
