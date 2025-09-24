// client/src/pages/OrderPage.tsx
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { useCart } from "@/hooks/useCart";

export default function OrderPage() {
  const { cart } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Place Your Order</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resumen del pedido */}
        <OrderSummary />

        {/* Formulario de cliente */}
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
