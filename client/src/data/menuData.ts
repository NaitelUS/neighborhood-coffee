export interface MenuItemData {
  name: string;
  descriptionHot?: string;
  descriptionIced?: string;
  description?: string;
  price: number;
  imageHot?: string;
  imageIced?: string;
  image?: string;
  variants?: string[];
  addOns?: { name: string; price: number }[];
  type?: "drink" | "empanada";
}

// 🔧 Add-ons globales (excepto Golden Coffee y Empanadas)
const defaultAddOns = [
  { name: "Extra Espresso Shot", price: 1.0 },
  { name: "Oat Milk", price: 0.75 },
  { name: "Vanilla Syrup", price: 0.5 },
  { name: "Caramel Syrup", price: 0.5 },
  { name: "Hazelnut Syrup", price: 0.5 },
  { name: "Whipped Cream", price: 0.5 },
];

export const menuData: MenuItemData[] = [
  {
    name: "Americano",
    descriptionHot: "Smooth and bold hot Americano.",
    descriptionIced: "Refreshing iced Americano.",
    price: 2.99,
    imageHot: "/attached_assets/americano_hot.png",
    imageIced: "/attached_assets/americano_cold.png",
    variants: ["Hot", "Iced"],
    addOns: defaultAddOns,
    type: "drink",
  },
  {
    name: "Latte",
    descriptionHot: "Creamy hot latte with rich espresso and milk.",
    descriptionIced: "Iced latte with espresso and chilled milk.",
    price: 3.99,
    imageHot: "/attached_assets/latte_hot.png",
    imageIced: "/attached_assets/latte_cold.png",
    variants: ["Hot", "Iced"],
    addOns: defaultAddOns,
    type: "drink",
  },
  {
    name: "Cappuccino",
    descriptionHot: "Classic hot cappuccino with frothy milk foam.",
    descriptionIced: "Iced cappuccino with milk and espresso.",
    price: 3.99,
    imageHot: "/attached_assets/cappuccino_hot.png",
    imageIced: "/attached_assets/cappuccino_cold.png",
    variants: ["Hot", "Iced"],
    addOns: defaultAddOns,
    type: "drink",
  },
  {
    name: "Mocha",
    descriptionHot: "Hot mocha with rich chocolate and espresso.",
    descriptionIced: "Iced mocha with espresso, milk, and chocolate.",
    price: 4.49,
    imageHot: "/attached_assets/mocha_hot.png",
    imageIced: "/attached_assets/mocha_cold.png",
    variants: ["Hot", "Iced"],
    addOns: defaultAddOns,
    type: "drink",
  },
  {
    name: "Caramel Macchiato",
    descriptionHot: "Hot caramel macchiato with espresso, milk, and caramel drizzle.",
    descriptionIced: "Iced caramel macchiato with espresso, milk, and caramel drizzle.",
    price: 4.49,
    imageHot: "/attached_assets/machiatto_hot.png",
    imageIced: "/attached_assets/machiatto_cold.png",
    variants: ["Hot", "Iced"],
    addOns: defaultAddOns,
    type: "drink",
  },
  {
    name: "Golden Coffee",
    description: "Turmeric-infused coffee blend with spices and milk.",
    price: 4.99,
    image: "/attached_assets/golden_coffee.png",
    variants: ["Hot"],
    addOns: [], // ❌ sin add-ons
    type: "drink",
  },
  {
    name: "Empanada",
    description: "Freshly baked empanadas filled with sweet fruit.",
    price: 2.49,
    image: "/attached_assets/empanada.png",
    variants: ["Apple", "Pineapple"],
    addOns: [], // ❌ sin add-ons
    type: "empanada",
  },
];
