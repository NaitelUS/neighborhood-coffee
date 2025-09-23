import { X } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  temperature?: string;
  quantity: number;
  basePrice: number;
  addOns: string[];
}

interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

interface Props {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  applyCoupon: (code: string) => void;
  couponApplied: boolean;
  removeItem: (index: number) => void;
  addOnOptions: AddOnOption[];
}

export default function OrderSummary({
  items,
  subtotal,
  discount,
  total,
  applyCoupon,
  couponApplied,
  removeItem,
  addOnOptions,
}: Props) {
  const handleApply =
