import Airtable from "airtable";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ORDERS } = process.env;
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
const ordersTable = base(AIRTABLE_TABLE_ORDERS);

export const handler = async (event) => {
  try {
    // Solo aceptar POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Extraer id, orderID y status del body
    const { id, orderID, status } = JSON.parse(event.body || "{}");

    if (!status || (!id && !orderID)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing 'status' and either 'id' or 'orderID'",
        }),
      };
    }

    // Resolver record id si solo se envió orderID
    let recordId = id;
    if (!recordId && orderID) {
      const found = await ordersTable
        .select({
          filterByFormula: `{OrderID} = '${orderID}'`,
          maxRecords: 1,
        })
        .firstPage();

      if (!found.length) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Order not found" }),
        };
      }
      recordId = found[0].id;
    }

    // Actualizar el campo Status en Airtable
    const updated = await ordersTable.update([
      {
        id: recordId,
        fields: { Status: status },
      },
    ]);

    console.log(
      `✅ Order updated: ${updated[0].id} → ${status} at ${new Date().toISOString()}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        id: updated[0].id,
        Status: status,
      }),
    };
  } catch (error) {
    console.error("❌ orders-update error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};
