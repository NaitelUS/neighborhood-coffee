import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const recordId = body.id;
    const newStatus = body.status;

    if (!recordId || !newStatus) {
      return { statusCode: 400, body: "Missing id or status" };
    }

    await base(process.env.AIRTABLE_TABLE_ORDERS!).update(recordId, {
      Status: newStatus,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Error updating status" }),
    };
  }
};
