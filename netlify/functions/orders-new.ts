import { getAirtableClient } from "../lib/airtableClient";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    const { orderID, items } = body;

    if (!orderID || !items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing or invalid orderID or items array",
        }),
      };
    }

    const base = getAirtableClient();
    const table = base("OrderItems");

    // 🔹 Crear los registros para cada producto
    const createdRecords = await Promise.all(
      items.map(async (item) => {
        const fields: any = {
          ProductName: item.name || "",
          Option: item.option || "",
          Price: Number(item.price) || 0,
          Qty: Number(item.qty) || 1,
          AddOns: item.addons || "",
          OrderID: orderID, // 👈 GUARDA el TNC-### aquí
        };

        const record = await table.create([{ fields }]);
        return record[0];
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order items created successfully",
        count: createdRecords.length,
      }),
    };
  } catch (error) {
    console.error("Error creating order items:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: error.message }),
    };
  }
};
