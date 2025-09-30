// netlify/functions/coupons.ts
import { coupons } from "../lib/coupons";

export const handler = async () => {
  const result = Object.entries(coupons).map(([code, discount]) => ({
    Code: code,
    Discount: discount * 100, // Si prefieres mostrarlo en %
    Active: true,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
