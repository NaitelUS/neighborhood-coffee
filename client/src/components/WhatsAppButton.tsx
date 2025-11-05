import React from "react";

export default function WhatsAppButton() {
  const phone = "+19154015547"; // ☕ tu número real
  const message = encodeURIComponent("Hi! I'd like to place an order ☕");
  const whatsappURL = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-5 z-50 flex items-center justify-center w-14 h-14 bg-[#1D9099] rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
    >
      {/* 🟢 SVG vectorial limpio (sin fondo, color blanco puro) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        width="26"
        height="26"
      >
        <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.5 2.1 7.8L.6 31.3l7.7-1.9C10.6 31 13.2 31.5 16 31.5c8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.2c-2.5 0-4.9-.6-7-1.8l-.5-.3-4.5 1.1 1.2-4.4-.3-.5c-1.3-2.1-2-4.6-2-7.1C3 8.2 8.9 2.3 16 2.3s13 5.9 13 13c0 7.1-5.9 13-13 13zm7.4-9.6c-.4-.2-2.3-1.1-2.6-1.2-.3-.1-.5-.2-.7.2s-.8 1.2-1 1.4-.4.3-.8.1c-.4-.2-1.5-.6-2.8-1.8-1-.9-1.8-2-2-2.4s0-.5.2-.7c.2-.2.4-.4.6-.6.2-.2.3-.4.5-.7.2-.3.1-.5 0-.7s-.7-1.8-1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1.1.5s-1.4 1.3-1.4 3.2 1.5 3.8 1.7 4c.2.3 2.9 4.5 7.1 6.3.9.4 1.6.6 2.2.8.9.3 1.7.3 2.3.2.7-.1 2.3-.9 2.7-1.8s.4-1.7.3-1.8c-.2-.1-.4-.2-.8-.4z" />
      </svg>
    </a>
  );
}
