import React from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 text-gray-700 leading-relaxed bg-white min-h-screen relative">
      {/* 🔙 Botón Back flotante */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-4 bg-[#00454E] text-white rounded-full p-2 shadow-md hover:opacity-90 z-40"
        title="Back to Home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h1 className="text-3xl font-semibold text-[#00454E] mb-6">
        Privacy Policy
      </h1>

      <p className="mb-4">
        The Neighborhood Coffee ("we", "our", or "us") respects your privacy and
        is committed to protecting your personal information. This Privacy
        Policy explains how we collect, use, and share data when you use our
        website, app, or services.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        1. Information We Collect
      </h2>
      <p className="mb-3">
        We may collect your name, phone number, and address when you place an
        order. This information is used only for order processing and
        communication.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <p className="mb-3">
        Your information helps us improve our services and enhance your
        experience. We never sell or rent your data to third parties.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        3. Data Security
      </h2>
      <p className="mb-3">
        We use reasonable measures to protect your personal information from
        unauthorized access or disclosure.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        4. Cookies
      </h2>
      <p className="mb-3">
        Our website may use cookies to improve user experience. You can disable
        cookies in your browser settings.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        5. Updates to This Policy
      </h2>
      <p className="mb-3">
        We may update this Privacy Policy periodically. Any changes will be
        posted here with an updated date.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        6. Contact Us
      </h2>
      <p>
        For questions about this Privacy Policy, please contact us at{" "}
        <a href="mailto:support@theneighborhoodcoffee.com" className="text-[#1D9099] underline">
          support@theneighborhoodcoffee.com
        </a>.
      </p>
    </div>
  );
}
