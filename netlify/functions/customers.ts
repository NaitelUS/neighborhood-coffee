import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async (event) => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_CUSTOMERS || "Customers");

    // ✅ Si se pasa un email o teléfono, buscar ese cliente
    const params = event.queryStringParameters || {};
    const email = params.email?.toLowerCase();
    const phone = params.phone;

    let records;

    if (email || phone) {
      const filter = email
        ? `LOWER({email}) = '${email}'`
        : `{phone} = '${phone}'`;

      records = await table.select({ filterByFormula: filter }).firstPage();
    } else {
      // Si no se pasa nada, trae todos (solo para test)
      records = await table.select().all();
    }

    // ✅ Mapeo seguro
    const customers = records.map((record) => ({
      id: record.id,
      name: record.fields.name || "",
      email: record.fields.email || "",
      phone: record.fields.phone || "",
      address: record.fields.address || "",
      createdAt: record.fields.createdAt || null,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(customers),
    };
  } catch (error) {
    console.error("Error loading customers:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch customers",
        details: error.message,
      }),
    };
  }
};

export { handler };
