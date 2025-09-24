// src/data/menuData.ts

export const menuData = [
  {
    name: "Americano",
    variants: {
      hot: {
        description: "Rich espresso shots with hot water, creating a smooth and bold coffee experience.",
        image: "/attached_assets/americano_hot.png",
        price: 3.75,
      },
      iced: {
        description: "Bold espresso poured over cold water and ice for a refreshing kick.",
        image: "/attached_assets/americano_iced.png",
        price: 3.75,
      },
    },
    addOns: [
      { name: "Extra Espresso Shot", price: 1.0 },
      { name: "Oat Milk", price: 0.75 },
      { name: "Vanilla Syrup", price: 0.5 },
      { name: "Caramel Syrup", price: 0.5 },
      { name: "Hazelnut Syrup", price: 0.5 },
      { name: "Whipped Cream", price: 0.5 },
    ],
  },
  {
    name: "Latte",
    variants: {
      hot: {
        description: "Perfectly steamed milk combined with our signature espresso for a creamy, comforting drink.",
        image: "/attached_assets/latte_hot.png",
        price: 4.5,
      },
      iced: {
        description: "Iced latte with smooth espresso and cold milk served over ice.",
        image: "/attached_assets/latte_iced.png",
        price: 4.5,
      },
    },
    addOns: [
      { name: "Extra Espresso Shot", price: 1.0 },
      { name: "Oat Milk", price: 0.75 },
      { name: "Vanilla Syrup", price: 0.5 },
      { name: "Caramel Syrup", price: 0.5 },
      { name: "Hazelnut Syrup", price: 0.5 },
      { name: "Whipped Cream", price: 0.5 },
    ],
  },
  {
    name: "Mocha",
    variants: {
      hot: {
        description: "Espresso and steamed milk blended with rich chocolate, topped with whipped cream.",
        image: "/attached_assets/mocha_hot.png",
        price: 4.75,
      },
      iced: {
        description: "Chilled mocha with espresso, milk, and chocolate over ice.",
        image: "/attached_assets/mocha_iced.png",
        price: 4.75,
      },
    },
    addOns: [
      { name: "Extra Espresso Shot", price: 1.0 },
      { name: "Oat Milk", price: 0.75 },
      { name: "Vanilla Syrup", price: 0.5 },
      { name: "Caramel Syrup", price: 0.5 },
      { name: "Hazelnut Syrup", price: 0.5 },
      { name: "Whipped Cream", price: 0.5 },
    ],
  },
  {
    name: "Caramel Macchiato",
    variants: {
      hot: {
        description: "Velvety steamed milk with espresso, topped with foamy milk and caramel drizzle.",
        image: "/attached_assets/machiatto_hot.png",
        price: 4.75,
      },
      iced: {
        description: "Chilled espresso layered with milk and ice, finished with caramel drizzle.",
        image: "/attached_assets/machiatto_cold.png",
        price: 4.75,
      },
    },
    addOns: [
      { name: "Extra Espresso Shot", price: 1.0 },
      { name: "Oat Milk", price: 0.75 },
      { name: "Vanilla Syrup", price: 0.5 },
      { name: "Caramel Syrup", price: 0.5 },
      { name: "Hazelnut Syrup", price: 0.5 },
      { name: "Whipped Cream", price: 0.5 },
    ],
  },
  {
    name: "Golden Coffee",
    variants: {
      hot: {
        description: "Unique turmeric-infused latte with warm spices for a cozy flavor.",
        image: "/attached_assets/golden_coffee.png",
        price: 5.0,
      },
    },
    addOns: [],
  },
  {
    name: "Empanada",
    variants: {
      apple: {
        description: "Freshly baked apple empanada with a golden crust.",
        image: "/attached_assets/empanada_apple.png",
        price: 2.5,
      },
      pineapple: {
        description: "Sweet pineapple empanada with a golden crust.",
        image: "/attached_assets/empanada_pineapple.png",
        price: 2.5,
      },
    },
    addOns: [],
  },
];
