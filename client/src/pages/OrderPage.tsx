import { useState } from "react";
import DrinkCard from "@/components/DrinkCard";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import Header from "@/components/Header";
import { drinkOptions, addOnOptions, COUPON_CODE, COUPON_DISCOUNT } from "@/data/menuData";

interface OrderItem {
  id: string;
  name: string;
  temperature?: "hot" | "iced";
  option?: string;
  quantity: number;
  basePrice: number;
  addOns: string[];
}

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleAddToOrder = (
    drinkId: string,
    temperature: "hot" | "iced",
    quantity: number,
    addOns: string[]
  ) => {
    const drink = drinkOptions.find((d) => d.id === drinkId);
    if (!drink) return;

    setOrderItems((prev) => [
      ...prev,
      {
        id: drink.id,
        name: drink.name,
        temperature,
        quantity,
        basePrice: drink.basePrice,
        addOns,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = orderItems.reduce((acc, item) =
