// ✅ netlify/lib/airtableClient.ts

import Airtable from "airtable";

export function getAirtableClient() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error("Missing Airtable credentials: check AIRTABLE_API_KEY and AIRTABLE_BASE_ID");
  }

  Airtable.configure({ apiKey });
  return new Airtable({ apiKey }).base(baseId);
}
