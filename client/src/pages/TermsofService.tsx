import React from "react";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <div className="flex justify-center mb-6">
        <img
          src="/attached_assets/tnclogo.png"
          alt="The Neighborhood Coffee"
          className="h-16 w-auto"
        />
      </div>
      <h1 className="text-3xl font-bold mb-4 text-[#00454E]">Terms of Service</h1>
      <p className="mb-4 text-sm text-gray-500">Last updated: October 2025</p>

      <p className="mb-4">
        Welcome to The Neighborhood Coffee. By using our website, app, or
        placing an order, you agree to the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Orders & Payments</h2>
      <p className="mb-4">
        All orders must be paid in full via Cash, Cash App, Zelle, or Stripe.
        Orders cannot be cancelled once preparation begins. Prices and
        availability are subject to change without notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Pick-Up & Delivery</h2>
      <p className="mb-4">
        We strive to prepare your order on time. Pick-up and delivery estimates
        are approximate. For delivery, please ensure your contact and address
        are correct to avoid delays.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Refunds & Returns</h2>
      <p className="mb-4">
        Due to the perishable nature of our products, all sales are final.
        However, if you experience any issue, contact us within 24 hours and
        we’ll make it right.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. User Conduct</h2>
      <p className="mb-4">
        Users must not misuse the website or app. Any fraudulent activity will
        result in immediate suspension and may be reported to authorities.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes</h2>
      <p className="mb-4">
        We may update these terms from time to time. The updated version will be
        posted on this page and effective immediately upon publication.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact</h2>
      <p>
        Questions about these Terms? <br />
        <strong>The Neighborhood Coffee</strong> <br />
        info@theneighborhoodcoffee.com <br />
        +1 (915) 401-5547
      </p>
    </div>
  );
}
