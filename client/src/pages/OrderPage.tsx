import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { useCart } from "@/hooks/useCart";
import MenuItem from "@/components/MenuItem";
import { useMenuData } from "@/hooks/useMenuData";

export default function OrderPage() {
  const { cart } = useCart();
  const { products, addons, coupons, loading } = useMenuData();

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading menu...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Our Menu</h1>

      {/* Menu grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {products.length > 0 ? (
          products.map((item) => <MenuItem key={item.id} item={item} />)
        ) : (
          <p className="text-center text-gray-500 col-span-2">
            No products available at this time.
          </p>
        )}
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
