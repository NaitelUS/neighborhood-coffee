import React from "react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-5 py-8 text-gray-700 leading-relaxed relative">
      {/* 🔙 Botón flotante */}
      <button
        onClick={() => navigate("/menu")}
        className="fixed top-20 left-4 bg-[#00454E] text-white rounded-full p-2 shadow-md hover:opacity-90 z-40"
        title="Back to Menu"
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

      <h1 className="text-3xl font-semibold text-[#00454E] mb-4">
        Terms of Service
      </h1>

      <p className="mb-3">
        Welcome to The Neighborhood Coffee. By accessing or using our website,
        mobile application, or any related services, you agree to be bound by
        these Terms of Service.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        1. Acceptance of Terms
      </h2>
      <p className="mb-3">
        By using our platform, you confirm that you are at least 18 years old
        and that you agree to comply with all applicable laws and regulations.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        2. Orders and Payments
      </h2>
      <p className="mb-3">
        All orders placed through our app or website are subject to acceptance
        and availability. We reserve the right to refuse or cancel any order if
        we suspect fraudulent activity or violation of these terms.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        3. User Responsibilities
      </h2>
      <p className="mb-3">
        You agree not to misuse our platform, interfere with other users, or
        attempt to gain unauthorized access to any part of the system.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        4. Modifications
      </h2>
      <p className="mb-3">
        We may update these Terms of Service from time to time. Continued use of
        our services after changes constitutes acceptance of the new terms.
      </p>

      <h2 className="text-xl font-semibold text-[#1D9099] mt-6 mb-2">
        5. Contact Us
      </h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:support@theneighborhoodcoffee.com" className="text-[#1D9099] underline">
          support@theneighborhoodcoffee.com
        </a>.
      </p>
    </div>
  );
}
