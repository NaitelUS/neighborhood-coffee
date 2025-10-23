{/* 🚚 Pickup / Delivery + Contact */}
<div className="flex justify-between items-center flex-wrap gap-3 mb-4">
  <div className="flex gap-3">
    <button
      type="button"
      onClick={() => handleMethodChange("Pickup")}
      className={`px-4 py-2 rounded-lg border font-medium transition-all ${
        form.method === "Pickup"
          ? "bg-[#00454E] text-white border-[#00454E]"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    >
      Pickup
    </button>
    <button
      type="button"
      onClick={() => handleMethodChange("Delivery")}
      className={`px-4 py-2 rounded-lg border font-medium transition-all ${
        form.method === "Delivery"
          ? "bg-[#00454E] text-white border-[#00454E]"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    >
      Delivery
    </button>
  </div>

  {/* 📞📍 Contact icons */}
  <div className="flex gap-6 sm:mt-2">
    <a
      href="tel:+19154015547"
      className="text-[#00454E] hover:opacity-80 transition"
      title="Call us"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 6.75C2.25 4.679 3.929 3 6 3h1.125c.621 0 1.136.45 1.221 1.066l.416 2.914a1.125 1.125 0 01-.288.933l-1.5 1.5a16.002 16.002 0 006.939 6.939l1.5-1.5a1.125 1.125 0 01.933-.288l2.914.416A1.125 1.125 0 0121 18.875V20c0 2.071-1.679 3.75-3.75 3.75H18c-8.837 0-16-7.163-16-16v-.25z"
        />
      </svg>
    </a>

    <a
      href="https://maps.google.com/?q=12821+Little+Misty+Ln,+El+Paso,+TX+79938"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#00454E] hover:opacity-80 transition"
      title="Open in Maps"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 11.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 10.5c0 7.125-9 12.75-9 12.75S3 17.625 3 10.5a9 9 0 1118 0z"
        />
      </svg>
    </a>
  </div>
</div>
