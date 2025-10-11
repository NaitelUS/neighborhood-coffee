import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";

export default function OrderPage() {
  const { cartItems, subtotal, discount, total } = useContext(CartContext);

  const handleScrollToButton = () => {
    const btn = document.getElementById("place-order-button");
    if (btn) btn.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  return (
    <div className="min-h-screen bg-[#fdf6ed] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#5a3825]">
            Review Your Order
          </h1>
          <p className="text-sm text-gray-600">
            Confirm your drinks and pickup details below.
          </p>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* 🧾 Orden */}
          <section className="bg-white rounded-2xl shadow-md p-4 md:p-6">
            <h2 className="text-lg font-medium text-[#5a3825] mb-3">
              Your Drinks
            </h2>
            <OrderSummary />
          </section>

          {/* 👤 Información del cliente */}
          <section className="bg-white rounded-2xl shadow-md p-4 md:p-6">
            <h2 className="text-lg font-medium text-[#5a3825] mb-3">
              Pickup Details
            </h2>
            <CustomerInfoForm />
          </section>
        </div>
      </div>

      {/* Barra fija móvil */}
      {isMobile && cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
          <div className="bg-white shadow-lg rounded-2xl border border-amber-100 p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${subtotal?.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>Discount</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-[#5a3825] text-base mb-3">
              <span>Total</span>
              <span>${total?.toFixed(2)}</span>
            </div>

            <button
              onClick={handleScrollToButton}
              className="w-full bg-[#00454E] hover:bg-[#00373E] text-white py-3 rounded-xl font-semibold transition"
            >
              Place Order ☕
            </button>
            <p className="text-[11px] text-center text-gray-500 mt-1">
              One last step to great coffee
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
