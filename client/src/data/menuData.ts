export interface Variant {
  description: string;
  image: string;
  price: number;
}

export interface MenuItemData {
  name: string;
  variants: {
    hot: Variant;
    iced?: Variant;
  };
  addOns?: { name: string; price: number }[];
}

export const menuData: MenuItemData[] = [
  {
    name: "Americano",
    variants: {
      hot: {
        description:
          "Rich espresso shots blended with hot water, delivering a bold and smooth hot coffee experience.",
        image: "/attached_assets/americano_hot.jpg",
        price: 3.75,
      },
      iced: {
        description:
          "Bold espresso poured over chilled water and ice for a smooth, refreshing coffee experience.",
        image: "/attached_assets/americano_iced.jpg",
        price: 3.75,
      },
    },
    addOns: [
      { name: "Extra Shot", price: 1.0 },
      { name: "Almond Milk", price: 0.75 },
      { name: "Oat Milk", price: 0.75 },
    ],
  },
  {
    name: "Latte",
    variants: {
      hot: {
        description:
          "Perfectly steamed milk combined with espresso for a creamy, comforting hot latte.",
        image: "/attached_assets/latte_hot.jpg",
        price: 4.5,
      },
      iced: {
        description:
          "Smooth espresso poured over cold milk and ice, for a refreshing and creamy iced latte.",
        image: "/attached_assets/latte_iced.jpg",
        price: 4.5,
      },
    },
    addOns: [
      { name: "Vanilla Syrup", price: 0.5 },
      { name: "Caramel Syrup", price: 0.5 },
      { name: "Soy Milk", price: 0.75 },
    ],
  },
  {
    name: "Caramel Macchiato",
    variants: {
      hot: {
        description:
          "Velvety steamed milk combined with rich espresso, finished with a warm caramel drizzle on top of foamy milk for a smooth and indulgent treat.",
        image: "/attached_assets/machiatto_hot.png",
        price: 4.5,
      },
      iced: {
        description:
          "Chilled espresso layered with creamy milk over ice, topped with a sweet caramel drizzle for a refreshing balance of bold and smooth flavors.",
        image: "/attached_assets/machiatto_cold.png",
        price: 4.5,
      },
    },
    addOns: [
      { name: "Extra Shot", price: 1.0 },
      { name: "Almond Milk", price: 0.75 },
      { name: "Oat Milk", price: 0.75 },
    ],
  },
  {
    name: "Golden Coffee",
    variants: {
      hot: {
        description:
          "A unique blend of espresso and spices, crafted to deliver a smooth, golden-hued coffee with a warming finish.",
        image: "/attached_assets/golden_coffee.jpg",
        price: 5.0,
      },
    },
    addOns: [{ name: "Extra Shot", price: 1.0 }],
  },
  {
    name: "Empanada",
    variants: {
      hot: {
        description:
          "Freshly baked empanadas with a golden crust, available in sweet and savory options.",
        image: "/attached_assets/empanada.jpg",
        price: 2.5,
      },
    },
    addOns: [
      { name: "Extra Cheese", price: 0.5 },
      { name: "Spicy Salsa", price: 0.3 },
    ],
  },
];
