import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Header from "./components/Header";
import Menu from "./components/Menu";
import OrderPage from "./pages/OrderPage";
import ThankYou from "./pages/ThankYou";
import AdminOrders from "./pages/AdminOrders";
import DeliveryPage from "./pages/DeliveryPage";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [splashMessage, setSplashMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/.netlify/functions/settings");
        const data = await res.json();
        console.log("Settings loaded ✅", data);

        if (data.showSplash) {
          setSplashMessage(data.splashMessage || "");
          setShowSplash(true);
          setTimeout(() => setShowSplash(false), 10000);
        } else {
          setShowSplash(false);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <Router>
      <CartProvider>
        {/* Splash de inicio */}
        {showSplash && (
          <SplashScreen
            visible={true}
            message={splashMessage || "Welcome to The Neighborhood Coffee ☕"}
            duration={10000}
          />
        )}

        <div className="min-h-screen bg-[#fffaf3]">
          <Header />

          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route
              path="*"
              element={
                <div className="text-center mt-20 text-gray-600 text-lg">
                  Page not found
                </div>
              }
            />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
