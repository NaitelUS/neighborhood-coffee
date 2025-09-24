import React from "react";
import Menu from "@/components/Menu";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";

const OrderPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Menú de productos */}
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Our Menu</h1>
        <Menu />
      </div>

      {/* Resumen de orden + info cliente */}
      <div className="lg:col-span-1 space-y-4">
        <OrderSummary />
        <CustomerInfoForm />
      </div>
    </div>
  );
};

export default OrderPage;
