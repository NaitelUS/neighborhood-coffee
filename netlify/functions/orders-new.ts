import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS!;
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS!;

// 🧠 Generar ID corto tipo TNC-4823
function generateShortId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TNC-${random}`;
}

export const handler: Handler = async (event) => {
  try {
    const orderData = JSON.parse(event.body || "{}");
    const shortId = generateShortId(); // ✅ ID corto global

    // 🧾 Crear orden principal
    const createdOrder = await base(TABLE_ORDERS).create([
      {
        fields: {
          OrderID: shortId, // ✅ Usamos este campo en Airtable
          Name: orderData.name,
          Phone: orderData.phone,
          OrderType: orderData.orderType,
          Address: orderData.address || "",
          ScheduleDate: orderData.scheduleDate || "",
          ScheduleTime: orderData.scheduleTime || "",
          Schedule
