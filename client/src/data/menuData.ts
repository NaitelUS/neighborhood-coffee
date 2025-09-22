// src/data/menuData.ts

export const drinkOptions = [
  {
    id: "americano",
    name: "Americano",
    basePrice: 3.75,
    description:
      "Rich espresso shots with hot water, creating a smooth and bold coffee experience.",
    images: {
      hot: "/attached_assets/Hot_Americano_Coffee_511b6324.png",
      iced: "/attached_assets/Iced_Americano_Coffee_57bcec89.png",
    },
  },
  {
    id: "latte",
    name: "Latte",
    basePrice: 4.5,
    description:
      "Perfectly steamed milk combined with our signature espresso for a creamy, comforting drink.",
    images: {
      hot: "/attached_assets/Hot_Latte_Coffee_c0cec515.png",
      iced: "/attached_assets/Iced_Latte_Coffee_ebf0391f.png",
    },
  },
  {
    id: "mocha",
    name: "Mocha",
    basePrice: 5.25,
    description:
      "A delightful blend of rich espresso, steamed milk, and decadent chocolate, topped with whipped cream.",
    images: {
      hot: "/attached_assets/Hot_Mocha_Coffee_0428bb6d.png",
      iced: "/attached_assets/Iced_Mocha_Coffee_8dea2fdb.png",
    },
  },
  {
    id: "golden",
    name: "Golden Coffee",
    basePrice: 4.75,
    description:
      "A unique blend of coffee with turmeric and warming spices, offering both flavor and wellness benefits.",
    images: {
      hot: "/attached_assets/Hot_Golden_Coffee_d91f826e.png",
      // Golden Coffee es solo HOT
    },
  },
  {
    id: "cafeaulait",
    name: "Café au Lait",
    basePrice: 4.25,
    description:
      "Traditional French-style coffee with equal parts strong coffee and steamed milk for a balanced taste.",
    images: {
      hot: "/attached_assets/Hot_Café_au_Lait_8c8a1ed2.png",
      iced: "/attached_assets/Iced_Café_au_Lait_60f2c4d8.png",
    },
  },
  {
    id: "empanada",
    name: "Handcrafted Empanadas",
    basePrice: 2.75,
    description:
      "Enjoy our artisan empanadas, handcrafted with a golden, flaky crust and filled with natural fruit jams.",
    variants: [
      {
        id: "appleEmpanada",
        label: "Apple",
        description:
          "A delicious, homemade turnover filled with a warm, natural apple filling.",
        image: "/attached_assets/Apple-Soon.png",
      },
      {
        id: "pineappleEmpanada",
        label: "Pineapple",
        description:
          "A flaky, handcrafted pastry filled with a sweet and tangy pineapple jam.",
        image: "/attached_assets/Pineapple-Soon.png",
      },
    ],
    comingSoon: true,
  },
];

// Cupón válido hardcoded
export const COUPON_CODE = "FALL2025";     // nombre del cupón
export const COUPON_DISCOUNT = 0.15;       // 15% de descuento

export const addOnOptions = [
  { id: "extraShot", name: "Extra Espresso Shot", price: 0.75 },
  { id: "oatMilk", name: "Oat Milk", price: 0.5 },
  { id: "hazelnutSyrup", name: "Hazelnut Syrup", price: 0.5 },
  { id: "caramelSyrup", name: "Caramel Syrup", price: 0.5 },
  { id: "vanillaSyrup", name: "Vanilla Syrup", price: 0.5 },
];
