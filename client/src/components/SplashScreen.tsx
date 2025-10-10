import React, { useEffect, useState } from "react";

interface Settings {
  showSplash: boolean;
  splashMessage?: string;
}

const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/.netlify/functions/settings");
        const data: Settings = await response.json();

        if (data.showSplash && !sessionStorage.getItem("fallSplashSeen")) {
          setMessage(data.splashMessage || "Use coupon NEIGHBOR15 — Valid until October 31st");
          setVisible(true);

          const timer = setTimeout(() => handleClose(), 10000);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    }

    fetchSettings();
  }, []);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("fallSplashSeen", "true");
    }, 500);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-[9999]
        bg-white bg-opacity-95 transition-opacity duration-500
        ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl transition-colors"
      >
        ✕
      </button>

      <img
        src="/attached_assets/Splash.png"
        alt="Seasonal Promotion"
        className="w-72 sm:w-80 md:w-96 max-w-[90%] rounded-2xl shadow-lg animate-fadeIn"
      />

      <p className="mt-4 text-sm text-gray-600 sm:text-base md:text-lg text-center px-4">
        {message}
      </p>
    </div>
  );
};

export default SplashScreen;
