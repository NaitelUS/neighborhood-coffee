import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <div className="flex justify-center mb-6">
        <img
          src="/attached_assets/tnclogo.png"
          alt="The Neighborhood Coffee"
          className="h-16 w-auto"
        />
      </div>
      <h1 className="text-3xl font-bold mb-4 text-[#00454E]">
        Privacy Policy
      </h1>
      <p className="mb-4 text-sm text-gray-500">Last updated: October 2025</p>

      <p className="mb-4">
        The Neighborhood Coffee (“we”, “our”, “us”) values your privacy. This
        Privacy Policy explains how we collect, use, and protect your
        information when you interact with our website and mobile app.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We collect personal details such as your name, phone number, delivery
        address, and order preferences when you place an order or contact us.
        Payment information is securely processed through third-party providers
        like Stripe or Cash App; we do not store payment card details.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use your data to process orders, communicate with you, and improve
        our services. Occasionally, we may send you promotional offers or updates
        if you’ve opted in.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h2>
      <p className="mb-4">
        We implement technical and organizational measures to keep your data safe.
        We never sell or share your information with third parties for marketing
        purposes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies</h2>
      <p className="mb-4">
        Our site uses cookies to enhance user experience and track performance
        analytics. You can disable cookies in your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <p className="mb-4">
        You may request access, correction, or deletion of your data at any time
        by contacting us at <span className="font-semibold">info@theneighborhoodcoffee.com</span>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact</h2>
      <p>
        For questions about this Privacy Policy, please contact us at: <br />
        <strong>The Neighborhood Coffee</strong> <br />
        12821 Little Misty Ln, El Paso, TX 79938 <br />
        +1 (915) 401-5547
      </p>
    </div>
  );
}
