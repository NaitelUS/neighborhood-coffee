// client/src/api/fetchAddOns.ts
export interface AddOn {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
}

export async function fetchAddOns(): Promise<AddOn[]> {
  try {
    const response = await fetch("/.netlify/functions/addons");
    if (!response.ok) throw new Error("Error fetching add-ons");

    const data = await response.json();

    // Filtra solo los disponibles
    return data.filter((addon: AddOn) => addon.available);
  } catch (error) {
    console.error("Error loading add-ons:", error);
    return [];
  }
}
