/**
 * Script para verificar que todas las funciones serverless están activas en Netlify.
 * Autor: Julio C. Méndez
 */

const siteBase = "https://theneighborhoodcoffee.netlify.app/.netlify/functions";

const endpoints = [
  "products",
  "productoptions",
  "addons",
  "coupons",
  "customers",
  "orders",
  "orderitems",
  "feedback",
  "settings",
  "messages",
  "users",
];

async function checkFunctions() {
  console.log("🔍 Verificando funciones en Netlify...\n");

  for (const endpoint of endpoints) {
    const url = `${siteBase}/${endpoint}`;
    try {
      const res = await fetch(url);
      const status = res.status;
      const ok = status === 200;
      console.log(`${ok ? "✅" : "❌"} ${endpoint.padEnd(15)} → ${status}`);
    } catch (error) {
      console.log(`🚫 ${endpoint.padEnd(15)} → Error de conexión`);
    }
  }

  console.log("\n🧩 Verificación finalizada.");
}

checkFunctions();
