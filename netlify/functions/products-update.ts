import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async (event) => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_PRODUCTS || "Products");

    const body = JSON.parse(event.body || "{}");
    const { id, ...fields } = body;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing product id" }),
      };
    }

    await table.update([{ id, fields }]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product updated successfully" }),
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to update product",
        details: error.message,
      }),
    };
  }
};

export { handler };
