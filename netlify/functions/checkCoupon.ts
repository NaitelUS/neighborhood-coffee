import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

const TABLE_COUPONS = process.env.AIRTABLE_TABLE_COUPONS || "Coupons";

export default async (req: Request) => {
  try {
    const { coupon } = await req.json();

    if (!coupon) {
      return new Response(
        JSON.stringify({ error: "Coupon code is required" }),
        { status: 400 }
      );
    }

    const records = await base(TABLE_COUPONS)
      .select({
        filterByFormula: `AND({Code}='${coupon}', {Active}=TRUE())`,
      })
      .all();

    if (records.length === 0) {
      return new Response(
        JSON.stringify({ valid: false, message: "Invalid or expired coupon" }),
        { status: 200 }
      );
    }

    const record = records[0];
    const discount = record.get("Discount") || 0;

    return new Response(
      JSON.stringify({
        valid: true,
        discount: Number(discount),
        message: "Coupon applied successfully",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error verifying coupon:", err);
    return new Response(
      JSON.stringify({ error: "Error verifying coupon" }),
      { status: 500 }
    );
  }
};
