// netlify/functions/orders-get.ts
import { getAirtableClient } from "../lib/airtableClient";

export async function handler(event) {
  const base = getAirtableClient();
  const { id } = event.queryStringParameters || {};

  try {
    // Si se pide un id específico
    if (id) {
      const record = await base("Orders").find(id);
      return {
        statusCode: 200,
        body: JSON.stringify({
          id: record.get("OrderID") || record.id,
          name: record.get("Name") || "",
          phone: record.get("Phone") || "",
          order_type: record.get("OrderType") || "",
          total: record.get("Total") || 0,
          status: record.get("Status") || "Received",
          schedule_date: record.get("ScheduleDate") || "",
          schedule_time: record.get("ScheduleTime") || "",
          notes: record.get("Notes") || "",
          created_at: record.get("CreatedAt") || "",
        }),
      };
    }

    // Si no se pide id → devolver todas las órdenes
    const records = await base("Orders")
      .select({
        sort: [{ field: "CreatedAt", direction: "desc" }],
      })
      .all();

    const formatted = records.map((r) => ({
      id: r.get("OrderID") || r.id,
      name: r.get("Name") || "",
      phone: r.get("Phone") || "",
      order_type: r.get("OrderType") || "",
      total: r.get("Total") || 0,
      status: r.get("Status") || "Received",
      schedule_date: r.get("ScheduleDate") || "",
      schedule_time: r.get("ScheduleTime") || "",
      notes: r.get("Notes") || "",
      created_at: r.get("CreatedAt") || "",
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formatted),
    };
  } catch (err) {
    console.error("Error in orders-get:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
