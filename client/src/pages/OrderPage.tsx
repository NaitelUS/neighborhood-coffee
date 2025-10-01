import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "@/context/CartContext";
import CouponField from "@/components/CouponField";
import MenuItem from "@/components/MenuItem";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { CheckCircle } from "lucide-react";
import { getProducts } from "@/api/api";

export default function OrderPage() {
  const { cart, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar productos dinámicamente
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // ✅ Calcular subtotal
  useEffect(() => {
    const sub = cart.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
    setSubtotal(sub);
  }, [cart]);

  // ✅ Calcular total con descuento
  useEffect(() => {
    const discounted = subtotal * (1 - discount);
    setTotal(discounted);
  }, [subtotal, discount]);

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4">Order Your Coffee ☕</h1>

      {/* 🧃 Sección de productos */}
      {loading ? (
        <p className="text-center text-muted-foreground">Loading menu...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <MenuItem key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 📋 Formulario de cliente */}
      <div className="border-t border-border mt-6 pt-6">
        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
        <CustomerInfoForm />
      </div>

      {/* 🧮 Resumen de pedido */}
      <div className="border-t border-border mt-6 pt-4 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({(discount * 100).toFixed(0)}%)</span>
            <span>- ${(subtotal * discount).toFixed(2)}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* 🏷️ Cupón */}
        <div className="mt-4 pt-2 border-t border-border">
          <p
            className={`flex items-center gap-2 text-sm font-medium mb-2 transition-all duration-500 ${
              discount > 0
                ? "text-green-600 animate-pulseOnce"
                : "text-muted-foreground opacity-90"
            }`}
          >
            {discount > 0 ? (
              <>
                <CheckCircle
                  size={16}
                  strokeWidth={2}
                  className="text-green-600 transition-transform duration-500 scale-110"
                />
                Coupon applied 🎉
              </>
            ) : (
              "Have a coupon?"
            )}
          </p>
          <CouponField onDiscountApply={(val) => setDiscount(val)} />
        </div>
      </div>

      {/* 🧾 Botones finales */}
      {cart.length > 0 && (
        <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Clear Cart
          </button>

          <button
            className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition font-semibold"
            onClick={() => {
              alert("Order submitted! Redirecting to Thank You...");
              // Aquí puedes usar navigate(`/thank-you/${orderId}`)
            }}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
