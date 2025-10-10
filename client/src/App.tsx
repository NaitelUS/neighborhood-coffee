import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Header from "./components/Header";
import Menu from "./components/Menu";

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [splashMessage, setSplashMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/.netlify/functions/settings");
        const data = await res.json();
        if (data.showSplash) {
          setSplashMessage(data.splashMessage || "");
          setShowSplash(true);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      {showSplash && (
        <SplashScreen
          image="/attached_assets/Splash.png"
          message={splashMessage}
          onClose={() => setShowSplash(false)}
        />
      )}

      <div className="min-h-screen bg-[#fffaf3]">
        <Header />
        <Menu />
        {/* Resto de tu contenido */}
      </div>
    </>
  );
}

export default App;
