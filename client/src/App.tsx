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
        console.log("Settings:", data);

        if (data.showSplash) {
          setSplashMessage(data.splashMessage || "");
          setShowSplash(true);
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
    <>
      {showSplash && (
        <SplashScreen
          visible={showSplash}
          message={splashMessage || "Welcome to The Neighborhood Coffee ☕"}
          duration={10000} // 10 segundos
        />
      )}

      <div className="min-h-screen bg-[#fffaf3]">
        <Header />
        <Menu />
      </div>
    </>
  );
}

export default App;
