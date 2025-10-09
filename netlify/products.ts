import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

export const handler = async () => {
  try {
    const records = await base("Products").select({ view: "Grid view" }).all();

    const products = records.map((r) => ({
      id: r.id,
      name: r.get("Name"),
      description: r.get("Description") || "",
      price: r.get("Price") || 0,
      image:
        r.get("Image")?.[0]?.url ||
        r.get("image_url") ||
        "", // Airtable o ruta local
      category: r.get("Category") || "Other",
      options: r.get("Options") || [],
      addons: r.get("AddOns") || [],
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error("⚠️ Error fetching products:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
