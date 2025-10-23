import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function WhatsAppButton() {
  const loc = useLocation();
  const show = ["/", "/menu", "/order"].includes(loc.pathname);
  const [hover, setHover] = useState(false);
  if (!show) return null;

  return (
    <div
      className="fixed left-4 bottom-4 z-50 flex items-center space-x-2"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => setTimeout(() => setHover(false), 2000)}
    >
      {hover && (
        <div className="bg-[#00454E] text-white text-xs rounded-lg px-3 py-1 shadow-md mr-2 animate-fadeIn">
          Chat with us
        </div>
      )}

      <a
        href="https://wa.me/19154015547?text=Hi!%20I'd%20like%20to%20place%20an%20order%20at%20The%20Neighborhood%20Coffee"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
      >
        <img
          src="/attached_assets/whatsapp-icon.png"
          alt="WhatsApp"
          className="w-6 h-6"
        />
      </a>
    </div>
  );
}
