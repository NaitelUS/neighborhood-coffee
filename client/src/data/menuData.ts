import type { DrinkOption, AddOn } from "@shared/schema";

// Import all coffee images
import hotAmericanoImg from '/attached_assets/Hot_Americano_Coffee_511b6324.png';
import icedAmericanoImg from '/attached_assets/Iced_Americano_Coffee_57bcec89.png';
import hotLatteImg from '/attached_assets/Hot_Latte_Coffee_c0cec515.png';
import icedLatteImg from '/attached_assets/Iced_Latte_Coffee_ebf0391f.png';
import hotMochaImg from '/attached_assets/Hot_Mocha_Coffee_0428bb6d.png';
import icedMochaImg from '/attached_assets/Iced_Mocha_Coffee_8dea2fdb.png';
import hotGoldenImg from '/attached_assets/Hot_Golden_Coffee_d91f826e.png';
import icedGoldenImg from '/attached_assets/Iced_Golden_Coffee_159e1f49.png';
import hotCafeLaitImg from '/attached_assets/Hot_Café_au_Lait_8c8a1ed2.png';
import icedCafeLaitImg from '/attached_assets/Iced_Café_au_Lait_60f2c4d8.png';

export const drinkOptions: DrinkOption[] = [
  {
    id: 'americano',
    name: 'Americano',
    description: 'Rich espresso shots with hot water, creating a smooth and bold coffee experience.',
    basePrice: 3.75,
    availableTemperatures: ['hot', 'iced'],
    images: {
      hot: hotAmericanoImg,
      iced: icedAmericanoImg,
    }
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Perfectly steamed milk combined with our signature espresso for a creamy, comforting drink.',
    basePrice: 4.50,
    availableTemperatures: ['hot', 'iced'],
    images: {
      hot: hotLatteImg,
      iced: icedLatteImg,
    }
  },
  {
    id: 'mocha',
    name: 'Mocha',
    description: 'A delightful blend of rich espresso, steamed milk, and decadent chocolate, topped with whipped cream.',
    basePrice: 5.25,
    availableTemperatures: ['hot', 'iced'],
    images: {
      hot: hotMochaImg,
      iced: icedMochaImg,
    }
  },
  {
    id: 'golden-coffee',
    name: 'Golden Coffee',
    description: 'A unique blend of coffee with turmeric and warming spices, offering both flavor and wellness benefits.',
    basePrice: 4.75,
    availableTemperatures: ['hot'],
    images: {
      hot: hotGoldenImg,
      iced: icedGoldenImg,
    }
  },
  {
    id: 'cafe-au-lait',
    name: 'Café au Lait',
    description: 'Traditional French-style coffee with equal parts strong coffee and steamed milk for a balanced taste.',
    basePrice: 4.25,
    availableTemperatures: ['hot', 'iced'],
    images: {
      hot: hotCafeLaitImg,
      iced: icedCafeLaitImg,
    }
  },
];

export const addOnOptions: AddOn[] = [
  {
    id: 'extra-shot',
    name: 'Extra Espresso Shot',
    price: 0.75,
  },
  {
    id: 'oat-milk',
    name: 'Oat Milk',
    price: 0.65,
  },
  {
    id: 'almond-milk',
    name: 'Almond Milk',
    price: 0.65,
  },
  {
    id: 'vanilla-syrup',
    name: 'Vanilla Syrup',
    price: 0.50,
  },
  {
    id: 'caramel-syrup',
    name: 'Caramel Syrup',
    price: 0.50,
  },
  {
    id: 'hazelnut-syrup',
    name: 'Hazelnut Syrup',
    price: 0.50,
  },
];
