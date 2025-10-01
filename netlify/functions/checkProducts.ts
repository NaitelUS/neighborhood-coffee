import { Handler } from "@netlify/functions";
import { getAirtableClient } from "../lib/airtableClient";

const handler: Handler = async () => {
  try {
    const base = getAirtableClient();
    const table = base(process.env.AIRTABLE_TABLE_PRODUCTS || "Products");

    const records = await table.select().all();

    const products = records.map((record) => {
      const fields = record.fields;
      const imageField =
        (Array.isArray(fields.Image) && fields.Image[0]?.url) ||
        fields.image_url ||
        fields.image ||
        null;

      return {
        id: record.id,
        name: fields.name || "Unnamed",
        price: fields.price || 0,
        image_url: imageField,
      };
    });

    // ✅ HTML de prueba
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Products Check</title>
        <style>
          body {
            font-family: sans-serif;
            padding: 2rem;
            background: #fafafa;
            color: #333;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
          }
          .card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            text-align: center;
            padding-bottom: 1rem;
          }
          img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-bottom: 1px solid #eee;
          }
          .missing {
            color: #d00;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>Products Check</h1>
        <p>Mostrando ${products.length} productos cargados desde Airtable.</p>
        <div class="grid">
          ${products
            .map(
              (p) => `
              <div class="card">
                <img src="${p.image_url || "/attached_assets/tnclogo.png"}" 
                     onerror="this.src='/attached_assets/tnclogo.png'">
                <h3>${p.name}</h3>
                <p><strong>$${p.price}</strong></p>
                ${
                  p.image_url
                    ? ""
                    : `<p class="missing">⚠️ Sin imagen_url</p>`
                }
              </div>`
            )
            .join("")}
        </div>
      </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: html,
    };
  } catch (err) {
    console.error("Error checking products:", err);
    return {
      statusCode: 500,
      body: `<h1>Error loading products</h1><p>${err.message}</p>`,
      headers: { "Content-Type": "text/html" },
    };
  }
};

export { handler };
