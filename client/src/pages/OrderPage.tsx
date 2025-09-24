// client/src/pages/OrderPage.tsx
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { menuItems } from "@/data/menuData";

export default function OrderPage() {
  return (
    <div className="container mx-auto flex gap-6 mt-8">
      <div className="w-2/3">
        <h2 className="text-xl font-bold mb-4">Our Coffee Menu</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select your drink or pastry, customize it, and add to order.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className="w-1/3">
        <OrderSummary />
        <CustomerInfoForm />
      </div>
    </div>
  );
}
