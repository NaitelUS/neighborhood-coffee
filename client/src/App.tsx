import { useEffect, useState } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
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

          // ⏱️ Ocultar automáticamente a los 10 s
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
    <div className="min-h-screen bg-[#fffaf3]">
      {/* ☕ Splash al inicio */}
      {showSplash && (
        <SplashScreen
          visible={true}
          message={splashMessage || "Welcome to The Neighborhood Coffee ☕"}
          duration={10000}
        />
      )}

      {/* 🧭 Contenido principal */}
      <Header />
      <Menu />
    </div>
  );
}

export default App;
