import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { useCart } from "@/hooks/useCart";
import { menuData } from "@/data/menuData";
import MenuItem from "@/components/MenuItem";

export default function OrderPage() {
  const { cart } = useCart();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Our Menu</h1>

      {/* Menu grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {menuData.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>

      {/* Order summary + form */}
      <div className="grid md:grid-cols-2 gap-6">
        <OrderSummary />
        <CustomerInfoForm />
      </div>

      {(cart ?? []).length === 0 && (
        <p className="text-gray-500 mt-6 text-sm text-center">
          Your cart is empty. Please add items to continue.
        </p>
      )}
    </div>
  );
}
