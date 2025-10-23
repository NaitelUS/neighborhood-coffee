import React from "react";

export default function QuickContact() {
  return (
    <div className="flex justify-center gap-10 mt-6 mb-4">
      {/* 📞 Call */}
      <a
        href="tel:+19154015547"
        className="flex flex-col items-center text-[#00454E] hover:opacity-80 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7 mb-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75C2.25 4.679 3.929 3 6 3h1.125c.621 0 1.136.45 1.221 1.066l.416 2.914a1.125 1.125 0 01-.288.933l-1.5 1.5a16.002 16.002 0 006.939 6.939l1.5-1.5a1.125 1.125 0 01.933-.288l2.914.416A1.125 1.125 0 0121 18.875V20c0 2.071-1.679 3.75-3.75 3.75H18c-8.837 0-16-7.163-16-16v-.25z" />
        </svg>
        <span className="text-xs font-medium">Call</span>
      </a>

      {/* 📍 Map */}
      <a
        href="https://maps.google.com/?q=12821+Little+Misty+Ln,+El+Paso,+TX+79938"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center text-[#00454E] hover:opacity-80 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7 mb-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5c0 7.125-9 12.75-9 12.75S3 17.625 3 10.5a9 9 0 1118 0z" />
        </svg>
        <span className="text-xs font-medium">Map</span>
      </a>
    </div>
  );
}
