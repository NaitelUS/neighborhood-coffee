import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const data = JSON.parse(event.body || "{}");
    const {
      name,
      phone,
      address,
      orderType,
      scheduleDate,
      scheduleTime,
      subtotal,
      discount,
      total,
      coupon,
      notes,
      items,
    } = data;

    if (!items || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing items" }),
      };
    }

    // ✅ Agrupar productos idénticos (mismo id + option + addons)
    const groupedItems = Object.values(
      items.reduce((acc, item) => {
        const key = `${item.id || item.name}-${item.option || ""}-${(item.addons || [])
          .map((a) => a.name || a)
          .sort()
          .join(",")}`;
        if (!acc[key]) {
          acc[key] = { ...item, qty: item.qty || 1 };
        } else {
          acc[key].qty += item.qty || 1;
        }
        return acc;
      }, {} as Record<string, any>)
    );

    // 🧾 Crear el registro en Orders
    const now = new Date();
    const orderId = `TNC-${now.getTime().toString().slice(-6)}`;

    const [orderRecord] = await base("Orders").create([
      {
        fields: {
          Name: name || "",
          Phone: phone || "",
          Address: address || "",
          OrderType: orderType || "",
          ScheduleDate: scheduleDate || "",
          ScheduleTime: scheduleTime || "",
          Subtotal: subtotal || 0,
          Discount: discount || 0,
          Total: total || 0,
          Coupon: coupon || "",
          Status: "Received",
          Notes: notes || "",
          OrderID: orderId,
          CreatedAt: now.toISOString(),
        },
      },
    ]);

    // 🧩 Crear registros en OrderItems (ya agrupados)
    await Promise.all(
      groupedItems.map(async (item) => {
        const addonsString = (item.addons || [])
          .map((a) => (typeof a === "string" ? a : a.name))
          .join(", ");

        await base("OrderItems").create([
          {
            fields: {
              Order: orderId,
              ProductName: item.name,
              Option: item.option || "",
              AddOns: addonsString,
              Price: item.price || 0,
              Qty: item.qty || 1,
            },
          },
        ]);
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        id: orderId,
        items: groupedItems,
      }),
    };
  } catch (error: any) {
    console.error("❌ Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
