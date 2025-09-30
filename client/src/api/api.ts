// client/src/api/api.ts
// 🔒 Este archivo solo llama a tus Netlify Functions del backend.
// ❌ No accede directamente a Airtable (por seguridad).

// --- PRODUCTS ---
export async function getProducts() {
  const res = await fetch("/.netlify/functions/products");
  if (!res.ok) throw new Error("❌ Failed to fetch products");
  return res.json();
}

// --- ADDONS ---
export async function getAddons() {
  const res = await fetch("/.netlify/functions/addons");
  if (!res.ok) throw new Error("❌ Failed to fetch addons");
  return res.json();
}

// --- COUPONS ---
export async function getCoupons() {
  const res = await fetch("/.netlify/functions/coupons");
  if (!res.ok) throw new Error("❌ Failed to fetch coupons");
  return res.json();
}

// --- CREATE ORDER ---
export async function createOrder(orderData: any) {
  const res = await fetch("/.netlify/functions/orders-new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) throw new Error("❌ Failed to create order");
  return res.json();
}

// --- CREATE ORDER ITEMS ---
export async function createOrderItems(items: any[], orderCode: string) {
  const res = await fetch("/.netlify/functions/orderitems-new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, orderCode }),
  });

  if (!res.ok) throw new Error("❌ Failed to create order items");
  return res.json();
}
