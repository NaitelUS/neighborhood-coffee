import React, { useEffect, useState } from "react";

const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("fallSplashSeen");
    if (!seen) {
      setVisible(true);
      const timer = setTimeout(() => handleClose(), 10000); // Auto-close after 10s
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("fallSplashSeen", "true");
    }, 500); // fade-out duration
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
        aria-label="Close"
      >
        ✕
      </button>

      <img
        src="/attached_assets/FallCoupon15.png"
        alt="Fall Coupon 15% Off"
        className="w-72 sm:w-80 md:w-96 max-w-[90%] rounded-2xl shadow-lg animate-fadeIn"
      />

      <p className="mt-4 text-sm text-gray-600 sm:text-base md:text-lg text-center px-4">
        Use coupon <span className="font-semibold text-orange-600">NEIGHBOR15</span> — Valid until{" "}
        <span className="font-semibold">October 31st</span>
      </p>
    </div>
  );
};

export default SplashScreen;
