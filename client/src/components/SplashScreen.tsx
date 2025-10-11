import React, { useEffect, useState } from "react";
import SplashImage from "/attached_assets/Splash.png"; // debe estar en client/public/attached_assets/Splash.png

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
        inset: 0,
        backgroundColor: "#fffaf3",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <img
        src={SplashImage}
        alt="The Neighborhood Coffee Promo"
        style={{
          maxWidth: "90%",
          height: "auto",
          marginBottom: "1rem",
        }}
      />
      <p
        style={{
          fontSize: "1.1rem",
          fontWeight: 500,
          color: "#3a2f2a",
          marginBottom: "20px",
          maxWidth: "80%",
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
