import type { Handler } from "@netlify/functions";

interface AirtableRecord<T> {
  id: string;
  fields: T;
}

interface Product {
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  active?: boolean;
}

const handler: Handler = async () => {
  try {
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_PRODUCTS}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      records: AirtableRecord<Product>[];
    };

    const products = data.records.map((rec) => ({
      id: rec.id,
      ...rec.fields,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };
