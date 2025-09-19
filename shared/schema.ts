import { z } from "zod";

// Coffee menu types
export interface DrinkOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  availableTemperatures: ('hot' | 'iced')[];
  images: {
    hot: string;
    iced: string;
  };
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  drinkId: string;
  drinkName: string;
  temperature: 'hot' | 'iced';
  quantity: number;
  basePrice: number;
  addOns: string[];
  totalPrice: number;
}

// Order form schemas
export const orderFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  customerAddress: z.string().min(5, "Please enter a valid address"),
  isDelivery: z.boolean(),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  items: z.array(z.object({
    drinkId: z.string(),
    drinkName: z.string(),
    temperature: z.enum(['hot', 'iced']),
    quantity: z.number().min(1),
    basePrice: z.number(),
    addOns: z.array(z.string()),
    totalPrice: z.number(),
  })).min(1, "Please add at least one item to your order"),
  specialNotes: z.string().optional(),
  orderTotal: z.number(),
});

export type OrderForm = z.infer<typeof orderFormSchema>;
