const { getAirtableClient } = require("../lib/airtableClient");

exports.handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const codeRaw = qs.code || qs.coupon || "";
    const code = String(codeRaw).trim();

    if (!code) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing coupon code" }) };
    }

    const base = getAirtableClient();
    const table = base("Coupons");

    const list = await table
      .select({ filterByFormula: `{Code} = '${code}'`, maxRecords: 1 })
      .firstPage();

    if (!list.length) {
      return { statusCode: 404, body: JSON.stringify({ valid: false, reason: "Not found" }) };
    }

    const f = list[0].fields || {};
    const active = !!(f.Active ?? f.IsActive ?? false);

    // Valida expiración si existe
    let notExpired = true;
    if (f.ExpiresAt) {
      const now = new Date();
      const exp = new Date(f.ExpiresAt);
      notExpired = now <= exp;
    }

    if (!active || !notExpired) {
      return { statusCode: 200, body: JSON.stringify({ valid: false, reason: "Inactive or expired" }) };
    }

    const discount = Number(f.Discount) || 0;

    return {
      statusCode: 200,
      body: JSON.stringify({
        valid: true,
        code,
        discount,
        type: f.Type || "amount", // por si manejas % o monto fijo
      }),
    };
  } catch (error) {
    console.error("checkCoupon error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error", details: error.message }) };
  }
};
