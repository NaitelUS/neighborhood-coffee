import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const TABLE_COUPONS = process.env.AIRTABLE_TABLE_COUPONS || "Coupons";

export const handler: Handler = async (event) => {
  try {
    const { code } = event.queryStringParameters || {};

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "⚠️ No coupon code provided.",
        }),
      };
    }

    // 🔎 Buscar por código (case-insensitive)
    const records = await base(TABLE_COUPONS)
      .select({
        filterByFormula: `LOWER({code}) = '${code.toLowerCase()}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          message: "❌ Invalid or expired coupon.",
        }),
      };
    }

    const record = records[0].fields;

    // 🧩 Validar campo Active (puede venir como true/false o 1/0)
    const isActive =
      record.active === true ||
      record.active === 1 ||
      record.Active === true ||
      record.Active === 1;

    if (!isActive) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          success: false,
          message: "❌ This coupon is not active.",
        }),
      };
    }

    // ✅ Leer porcentaje
    const discount = Number(record.percent_off) || 0;
    if (discount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "❌ Invalid discount value.",
        }),
      };
    }

    // 📅 Validar fechas si existen
    const now = new Date();
    if (record.valid_from && new Date(record.valid_from) > now) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "⚠️ This coupon is not active yet.",
        }),
      };
    }
    if (record.valid_until && new Date(record.valid_until) < now) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "⚠️ This coupon has expired.",
        }),
      };
    }

    // ✅ Cupón válido
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        code: record.code,
        discount, // percent_off
      }),
    };
  } catch (error) {
    console.error("⚠️ Error verifying coupon:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message:
          "⚠️ Unable to verify coupon right now. Please try again later.",
      }),
    };
  }
};
