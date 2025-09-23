import { useMemo, useState } from "react";
import DrinkCard from "@/components/DrinkCard";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { drinkOptions, addOnOptions, COUPON_CODE, COUPON_DISCOUNT } from "@/data/menuData";
import { useCart } from "@/hooks/useCart";

export default function OrderPage() {
  const { items, addItem, removeItem, clearCart, subtotal } = useCart();
  const [couponApplied, setCouponApplied] = useState(false);

  // handler que recibe desde DrinkCard ids de addOns y los mapea a objetos
  const handleAddToOrder = (
    drinkId: string,
    temperature: "hot" | "iced",
    quantity: number,
    addOnIds: string[] = []
  ) => {
    const drink = drinkOptions.find((d) => d.id === drinkId);
    if (!drink) return;

    const mappedAddOns =
      (addOnIds || [])
        .map((id) => addOnOptions.find((a) => a.id === id))
        .filter(Boolean)
        .map((a) => ({ id: a!.id, name: a!.name, price: a!.price })) || [];

    addItem({
      id: drink.id,
      name: drink.name,
      temperature,
      option: undefined,
      quantity: Math.max(1, Number(quantity || 1)),
      basePrice: Number(drink.basePrice || 0),
      addOns: mappedAddOns,
    });
  };

  const discount = useMemo(() => (couponApplied ? subtotal * COUPON_DISCOUNT : 0), [couponApplied, subtotal]);
  const total = useMemo(() => subtotal - discount, [subtotal, discount]);

  const applyCoupon = (code: string) => {
    if (code.trim().toUpperCase() === COUPON_CODE) setCouponApplied(true);
  };

  const handleSubmitOrder = (info: any) => {
    const orderNo = Date.now().toString().slice(-5);

    const payload = {
      items,
      info,
      subtotal,
      discount,
      total,
      status: "☕ Received",
    };

    localStorage.setItem(`order-${orderNo}`, JSON.stringify(payload));
    localStorage.removeItem("current-order");
    clearCart();

    window.location.href = `/thank-you?orderNo=${orderNo}`;
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Menu */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold mb-2">Our Coffee Menu</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {drinkOptions.map((drink) => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              addOns={addOnOptions}
              onAddToOrder={handleAddToOrder}
            />
          ))}
        </div>
      </div>

      {/* Order Summary + Customer Info */}
      <div id="order-form">
        <OrderSummary
          couponApplied={couponApplied}
          applyCoupon={applyCoupon}
          discount={discount}
          total={total}
          onRemoveItem={removeItem}
        />
        <div className="mt-6">
          <CustomerInfoForm onSubmit={handleSubmitOrder} />
        </div>
      </div>
    </div>
  );
}
