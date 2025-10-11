import React, { useEffect, useState } from "react";

const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    // Bloquea el scroll del body mientras el splash está visible
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Autocierre a los 10s
    const timer = setTimeout(() => setVisible(false), 10000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow; // restaura scroll
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Seasonal promotion"
    >
      <img
        src="/attached_assets/Splash.png"
        alt="The Neighborhood Coffee promotion"
        className="w-80 max-w-[90%] mb-4"
      />
      <p className="text-lg font-semibold text-amber-800 mb-2">
        Seasonal Offer — 15% OFF
      </p>
      <p className="text-sm text-gray-600 mb-6">Valid until October 31st</p>
      <button
        onClick={() => setVisible(false)}
        className="bg-amber-700 text-white px-5 py-2 rounded-full hover:bg-amber-800 transition"
      >
        Got it
      </button>
    </div>
  );
};

export default SplashScreen;
