import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

exports.handler = async (event) => {
  try {
    const { id, status } = JSON.parse(event.body);

    if (!id || !status) {
      return { statusCode: 400, body: "Missing id or status" };
    }

    await base(process.env.AIRTABLE_TABLE_ORDERS!).update(id, {
      Status: status,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
