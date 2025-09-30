// client/src/api/api.ts
import Airtable from "airtable";

const base = new Airtable({ apiKey: import.meta.env.AIRTABLE_API_KEY }).base(
  import.meta.env.AIRTABLE_BASE_ID
);

// --- PRODUCTS ---
export async function getProducts() {
  const tableName = import.meta.env.AIRTABLE_TABLE_PRODUCTS;
  const records = await base(tableName)
    .select({ filterByFormula: "Active" })
    .all();

  return records.map((r) => ({
    id: r.id,
    ...r.fields,
  }));
}

// --- COUPONS ---
export async function getCoupons() {
  const tableName = import.meta.env.AIRTABLE_TABLE_COUPONS;
  const records = await base(tableName)
    .select({ filterByFormula: "Active" })
    .all();

  return records.map((r) => ({
    id: r.id,
    ...r.fields,
  }));
}

// --- CREATE ORDER ---
export async function createOrder(orderData: any) {
  const tableName = import.meta.env.AIRTABLE_TABLE_ORDERS;

  const created = await base(tableName).create([
    {
      fields: orderData,
    },
  ]);

  return created[0];
}

// --- CREATE ORDER ITEMS ---
export async function createOrderItems(items: any[], orderCode: string) {
  const tableName = import.meta.env.AIRTABLE_TABLE_ORDERITEMS;

  const formatted = items.map((i) => ({
    fields: {
      OrderLink: orderCode,
      ProductName: i.name,
      Quantity: i.quantity,
      Price: i.price,
      Subtotal: i.quantity * i.price,
    },
  }));

  await base(tableName).create(formatted);
}
