import React, { useEffect, useState } from "react";

const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000); // 10 segundos
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <img
        src="/attached_assets/Splash.png"
        alt="The Neighborhood Coffee Splash"
        className="w-80 max-w-[90%] mb-4"
      />
      <p className="text-lg font-semibold text-amber-800 mb-3">
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
