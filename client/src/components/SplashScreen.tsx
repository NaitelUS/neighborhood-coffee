import React, { useEffect, useState } from "react";
import SplashImage from "/attached_assets/Splash.png"; // asegúrate de que esté en public/attached_assets/Splash.png

interface SplashScreenProps {
  message: string;
  visible: boolean;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  message,
  visible,
  duration = 10000,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  if (!show) return null;

  return (
    <div
      id="splash-root"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#fffaf3",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden",
        padding: "0 1rem",
      }}
    >
      <img
        src={SplashImage}
        alt="The Neighborhood Coffee Promo"
        style={{
          width: "min(400px, 80vw)",
          height: "auto",
          maxHeight: "60vh",
          objectFit: "contain",
          marginBottom: "1rem",
        }}
      />
      <p
        style={{
          fontSize: "1rem",
          fontWeight: 500,
          color: "#3a2f2a",
          marginBottom: "1.5rem",
          maxWidth: "90%",
          lineHeight: "1.4",
        }}
      >
        {message}
      </p>
      <button
        onClick={() => setShow(false)}
        style={{
          backgroundColor: "#3a2f2a",
          color: "#fffaf3",
          border: "none",
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Got it
      </button>
    </div>
  );
};

export default SplashScreen;
