import React from "react";
import Header from "./components/Header";
import { CartProvider, useCart } from "./context/CartContext";

const TestComponent = () => {
  const cart = useCart();
  return (
    <div style={{ padding: 40 }}>
      <h2>🧪 CartContext Test</h2>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <Header />
      <TestComponent />
    </CartProvider>
  );
}
