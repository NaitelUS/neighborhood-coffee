import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async (event) => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_PRODUCTS || "Products");

    const body = JSON.parse(event.body || "{}");

    const record = await table.create([
      {
        fields: {
          name: body.name,
          description: body.description,
          price: Number(body.price) || 0,
          category: body.category || "Drink",
          image_url: body.image_url || "",
        },
      },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: record[0].id }),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create product", details: error.message }),
    };
  }
};

export { handler };
