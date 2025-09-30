import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { getProducts, getAddons, createOrder, createOrderItems } from "@/api/api";
import MenuItem from "@/components/MenuItem";
import CouponField from "@/components/CouponField";

export default function OrderPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const { cart, clearCart } = useCart();

  // 🚀 Cargar productos y addons desde Airtable
  useEffect(() => {
    Promise.all([getProducts(), getAddons()])
      .then(([productsData, addonsData]) => {
        setProducts(productsData);
        setAddons(addonsData);
      })
      .catch(console.error);
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  // 🧠 Envío de la orden
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
        Total: total,
        Status: "Pending",
        Created: new Date().toISOString(),
      };

      const order = await createOrder(orderData);

      // Crear los ítems asociados
      const orderId = order?.fields?.OrderCode || order?.id;
      if (orderId) {
        await createOrderItems(cart, orderId);
      }

      alert("✅ Order created successfully!");
      clearCart();
      form.reset();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 md:px-12 py-10">
      {/* Header */}
      <header className="flex flex-col items-center text-center mb-10">
        <img
          src="/logo.png"
          alt="The Neighborhood Coffee"
          className="h-20 mb-4"
        />
        <h1 className="text-3xl md:text-4xl font-serif tracking-wide">
          The <span className="text-primary">Neighborhood</span> Coffee
        </h1>
        <p className="text-muted-foreground mt-2">From our house to yours ☕</p>
      </header>

      {/* Menu Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
          Our Menu
        </h2>

        {/* 🧁 Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              addons={addons.filter((a) => a.Category === "Drink")}
            />
          ))}
        </div>
      </section>

      {/* Order Summary */}
      <section className="bg-card rounded-xl shadow-lg p-6 md:p-8 max-w-xl mx-auto border">
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
                <div>
                  <span className="block font-medium">{item.name}</span>
                  {item.addons?.length > 0 && (
                    <ul className="text-xs text-gray-500 ml-3 list-disc">
                      {item.addons.map((addon: string, i: number) => (
                        <li key={i}>{addon}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <span>${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Coupon Field */}
        <CouponField />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold mt-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </section>

      {/* Info Form */}
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
    </div>
  );
}
