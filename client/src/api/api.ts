// client/src/api/api.ts
// Este archivo ahora solo llama a tus Netlify Functions del backend.

export async function getProducts() {
  const res = await fetch("/.netlify/functions/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// --- ADDONS ---
export async function getAddons() {
  const tableName = import.meta.env.AIRTABLE_TABLE_ADDONS;
  const records = await base(tableName)
    .select({ filterByFormula: "Active" })
    .all();

  return records.map((r) => ({
    id: r.id,
    ...r.fields,
  }));
}

export async function getCoupons() {
  const res = await fetch("/.netlify/functions/coupons");
  if (!res.ok) throw new Error("Failed to fetch coupons");
  return res.json();
}

export async function createOrder(orderData: any) {
  const res = await fetch("/.netlify/functions/orders-new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function createOrderItems(items: any[], orderCode: string) {
  const res = await fetch("/.netlify/functions/orderitems-new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, orderCode }),
  });

  if (!res.ok) throw new Error("Failed to create order items");
  return res.json();
}
