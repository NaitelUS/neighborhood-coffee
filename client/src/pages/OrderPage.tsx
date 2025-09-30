import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { getProducts, createOrder, createOrderItems } from "@/api/api";
import MenuItem from "@/components/MenuItem";
import CouponField from "@/components/CouponField";
import Header from "@/components/Header";

export default function OrderPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const { cart, clearCart } = useCart();

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const total = Math.max(subtotal - discount, 0);

  const handleCouponApplied = (value: number) => {
    setDiscount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const form = e.target as HTMLFormElement;
      const name = form.querySelector('input[required]')?.value || "";
      const phone = form.querySelector('input[type="tel"]')?.value || "";
      const email = form.querySelector('input[type="email"]')?.value || "";
      const address = form.querySelector('textarea')?.value || "";

      if (!name || cart.length === 0) {
        alert("⚠️ Please enter your name and select at least one item.");
        return;
      }

      const orderData = {
        CustomerName: name,
        Phone: phone,
        Email: email,
        Address: address,
        Subtotal: subtotal,
        Discount: discount,
        Total: total,
        Status: "Pending",
        Created: new Date().toISOString(),
      };

      const order = await createOrder(orderData);
      const orderId = order?.fields?.OrderCode || order?.id;
      if (orderId) await createOrderItems(cart, orderId);

      alert("✅ Order created successfully!");
      clearCart();
      form.reset();
      setDiscount(0);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="px-6 md:px-12 py-10">
        {/* Menu */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-center">
            Our Menu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section
          id="order-summary"
          className="bg-card rounded-xl shadow-lg p-6 md:p-8 max-w-xl mx-auto border"
        >
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {cart.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3 mb-4">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between text-sm border-b border-border pb-1"
                >
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}

          <CouponField onApply={handleCouponApplied} />

          <div className="flex justify-between text-lg font-semibold mt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </section>

        {/* Formulario */}
        <section className="max-w-xl mx-auto mt-12">
          <h2 className="text-xl font-semibold mb-4">Your Info</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1 font-medium">Name *</label>
              <input
                className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Phone</label>
              <input
                className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
                type="tel"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Email</label>
              <input
                className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
                type="email"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Address</label>
              <textarea
                className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
                rows={2}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Submit Order
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
