import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const {
      customerName,
      customerPhone,
      deliveryType,
      scheduleDate,
      scheduleTime,
      cartItems,
      total,
    } = body;

    if (!cartItems || cartItems.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Empty cart" }) };
    }

    // 🧠 Generar ID incremental TNC-001, TNC-002, etc.
    const orders = await base("Orders").select({}).all();
    const nextId = orders.length + 1;
    const orderId = `TNC-${String(nextId).padStart(3, "0")}`;

    // 🗂 Crear registro en Orders
    const orderRecord = await base("Orders").create([
      {
        fields: {
          OrderID: orderId,
          CustomerName: customerName,
          Phone: customerPhone,
          Type: deliveryType,
          ScheduledDate: scheduleDate,
          ScheduledTime: scheduleTime,
          Total: total,
          Status: "Pending",
        },
      },
    ]);

    // 📦 Crear OrderItems relacionados
    await Promise.all(
      cartItems.map((item: any) =>
        base("OrderItems").create([
          {
            fields: {
              ProductName: item.name,
              Option: item.option,
              Price: item.basePrice + (item.addons?.reduce((s: number, a: any) => s + a.price, 0) || 0),
              AddOns:
                item.addons && item.addons.length > 0
                  ? item.addons.map((a: any) => a.name).join(", ")
                  : "",
              Qty: item.qty || 1,
              Order: orderId,
            },
          },
        ])
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId }),
    };
  } catch (err) {
    console.error("Order creation failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
