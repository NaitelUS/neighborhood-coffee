// client/src/data/menuData.ts

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  options?: string[];
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export const COUPON_CODE = "NEIGHBOR15";
export const COUPON_DISCOUNT = 0.15;

export const menuData: MenuItem[] = [
  {
    id: "americano",
    name: "Americano",
    description: "Rich espresso shots with hot water for a bold coffee.",
    price: 3.75,
    image: "/attached_assets/americano_hot.png",
    options: ["Hot", "Iced"],
  },
  {
    id: "latte",
    name: "Latte",
    description: "Perfectly steamed milk with our espresso for a creamy drink.",
    price: 4.5,
    image: "/attached_assets/latte_hot.png",
    options: ["Hot", "Iced"],
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "Espresso, chocolate, and steamed milk topped with whipped cream.",
    price: 4.75,
    image: "/attached_assets/mocha_hot.png",
    options: ["Hot", "Iced"],
  },
  {
    id: "macchiato",
    name: "Caramel Macchiato",
    description: "Velvety espresso layered with steamed milk and caramel drizzle.",
    price: 4.75,
    image: "/attached_assets/machiatto_hot.png",
    options: ["Hot", "Iced"],
  },
  {
    id: "golden",
    name: "Golden Coffee",
    description: "Turmeric, ginger, cinnamon, and black pepper with milk and honey.",
    price: 5.0,
    image: "/attached_assets/golden_coffee.png",
  },
  {
    id: "empanada",
    name: "Empanada",
    description: "Flaky pastry filled with sweet fruit filling.",
    price: 2.5,
    image: "/attached_assets/empanada_apple.png",
    options: ["Apple", "Pineapple"],
  },
];

export const addOnOptions: AddOn[] = [
  { id: "extra_shot", name: "Extra Espresso Shot", price: 0.75 },
  { id: "oat_milk", name: "Oat Milk", price: 0.5 },
  { id: "vanilla", name: "Vanilla Syrup", price: 0.5 },
  { id: "caramel", name: "Caramel Syrup", price: 0.5 },
  { id: "hazelnut", name: "Hazelnut Syrup", price: 0.5 },
  { id: "whipped", name: "Whipped Cream", price: 0.5 },
];
