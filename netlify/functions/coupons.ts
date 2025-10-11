import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_COUPONS || "Coupons");

    const records = await table.select().all();

    const coupons = records.map((record) => {
      const fields = record.fields;

      return {
        id: record.id,
        code: (fields.code || "").trim().toUpperCase(),
        percent_off:
          typeof fields.percent_off === "number"
            ? fields.percent_off
            : parseFloat(fields.percent_off) / 100 || 0,
        valid_from: fields.valid_from || null,
        valid_until: fields.valid_until || null,

        // ✅ Garantiza booleano
        active: !!fields.active && fields.active !== "false" && fields.active !== 0,
      };
    });

    // ✅ Filtra solo cupones activos y válidos por fecha
    const now = new Date();
    const validCoupons = coupons.filter((coupon) => {
      const from = coupon.valid_from ? new Date(coupon.valid_from) : null;
      const until = coupon.valid_until ? new Date(coupon.valid_until) : null;
      const isWithinDate =
        (!from || now >= from) && (!until || now <= until);
      return coupon.active && isWithinDate && coupon.code.length > 0;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(validCoupons),
    };
  } catch (error: any) {
    console.error("❌ Error loading coupons:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch coupons",
        details: error.message,
      }),
    };
  }
};

export { handler };
