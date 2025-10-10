import { useEffect, useState } from "react";

interface SplashScreenProps {
  message: string;
  image?: string;
  onClose: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ message, image, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 10000); // ⏱️ 10 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]"
      style={{
        backgroundColor: "#fffaf3",
      }}
    >
      {image ? (
        <img
          src={image}
          alt="Promotion"
          className="w-80 h-auto mb-4 rounded-lg shadow-lg"
          onError={(e) => {
            console.error("Error loading splash image:", e);
          }}
        />
      ) : (
        <p className="text-gray-600 mb-4">Loading promotion...</p>
      )}

      <p className="text-lg text-gray-800 font-semibold text-center max-w-md mb-6 px-4">
        {message || "Welcome to The Neighborhood Coffee ☕"}
      </p>

      <button
        onClick={() => {
          setVisible(false);
          onClose();
        }}
        className="bg-[#8B4513] text-white px-5 py-2 rounded-lg shadow hover:bg-[#a0522d] transition-all"
      >
        Close
      </button>
    </div>
  );
};

export default SplashScreen;
