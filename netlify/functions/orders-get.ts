import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";

export const handler: Handler = async () => {
  try {
    const records = await base(TABLE_ORDERS)
      .select({
        sort: [{ field: "OrderNumber", direction: "desc" }],
        view: "Grid view",
      })
      .all();

    const data = records.map((r) => ({
      id: r.id,
      fields: {
        OrderID: r.get("OrderID") || "",
        OrderNumber: r.get("OrderNumber") || "",
        Name: r.get("Name") || "",
        Phone: r.get("Phone") || "",
        OrderType: r.get("OrderType") || "",
        Address: r.get("Address") || "",
        ScheduleDate: r.get("ScheduleDate") || "",
        ScheduleTime: r.get("ScheduleTime") || "",
        Subtotal: Number(r.get("Subtotal")) || 0,
        Discount: Number(r.get("Discount")) || 0,
        Total: Number(r.get("Total")) || 0,
        Coupon: r.get("Coupon") || "",
        Notes: r.get("Notes") || "",
        Status: r.get("Status") || "",
        CreatedAt: r.get("CreatedAt") || "",
      },
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, records: data }),
    };
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to fetch orders" }),
    };
  }
};
