import Airtable from "airtable";

// 👇 Esta es la función estándar que Netlify ejecuta
export async function handler() {
  console.log("🚀 Starting Airtable test");

  try {
    const key = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!key || !baseId) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "❌ Missing Airtable credentials",
          key: !!key,
          baseId,
        }),
      };
    }

    const base = new Airtable({ apiKey: key }).base(baseId);

    const createdAt = new Date().toISOString();
    const orderNumber = `TEST-${Date.now().toString().slice(-3)}`;

    const record = await base("Orders").create([
      {
        fields: {
          Name: "Test Julio",
          Phone: "0000000000",
          OrderType: "Pickup",
          Subtotal: 1,
          Discount: 0,
          Total: 1,
          Status: "Received",
          OrderNumber: orderNumber,
          CreatedAt: createdAt,
        },
      },
    ]);

    console.log("✅ Created record:", record[0].id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "✅ Connected to Airtable",
        recordId: record[0].id,
        orderNumber,
      }),
    };
  } catch (error: any) {
    console.error("💥 Airtable test failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "💥 Airtable test failed",
        error: error.message,
      }),
    };
  }
}
