import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#00454E] text-white text-sm py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-2">
        <p className="font-semibold text-base">The Neighborhood Coffee</p>

        <p>
          <a href="tel:+19154015547" className="hover:underline">
            📞 (915) 401-5547
          </a>{" "}
          |{" "}
          <a
            href="https://maps.google.com/?q=12821+Little+Misty+Ln,+El+Paso,+TX+79938"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            📍 12821 Little Misty Ln, El Paso, TX
          </a>
        </p>

        <p>🕓 Mon–Sat 6 AM – 12 PM •</p>

        <div className="space-x-3">
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <span>|</span>
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>

        <p className="text-xs opacity-80 mt-2">
          © {new Date().getFullYear()} The Neighborhood Coffee. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
