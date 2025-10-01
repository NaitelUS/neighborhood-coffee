import React, { useState } from "react";

interface EndpointResult {
  name: string;
  url: string;
  method?: string;
  response?: any;
  error?: string;
}

const endpoints = [
  { name: "Products", url: "/.netlify/functions/products" },
  { name: "Add-ons", url: "/.netlify/functions/addons" },
  { name: "Coupons", url: "/.netlify/functions/coupons" },
  { name: "Settings", url: "/.netlify/functions/settings" },
  { name: "Orders (GET)", url: "/.netlify/functions/orders-get" },
  { name: "Feedback (GET)", url: "/.netlify/functions/feedback" },
  { name: "Check Coupon (WELCOME10)", url: "/.netlify/functions/checkCoupon?code=WELCOME10" },
];

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [results, setResults] = useState<EndpointResult[]>([]);

  const handleLogin = () => {
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    if (password === adminPass) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect password");
    }
  };

  const testEndpoint = async (endpoint: EndpointResult) => {
    try {
      const res = await fetch(endpoint.url);
      const json = await res.json();

      setResults((prev) =>
        prev.map((r) =>
          r.name === endpoint.name ? { ...r, response: json, error: undefined } : r
        )
      );
    } catch (error) {
      setResults((prev) =>
        prev.map((r) =>
          r.name === endpoint.name
            ? { ...r, error: String(error), response: undefined }
            : r
        )
      );
    }
  };

  const testAll = async () => {
    setResults(endpoints.map((e) => ({ ...e })));

    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white shadow-md rounded-xl p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Admin Panel Access
        </h2>
        <input
          type="password"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg"
        >
          Enter
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-3xl font-bold text-amber-700 mb-6 text-center">
        ☕ Admin Panel — Endpoint Tester
      </h2>

      <button
        onClick={testAll}
        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold mb-6"
      >
        Test All Endpoints
      </button>

      <div className="space-y-4">
        {results.map((r) => (
          <div
            key={r.name}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">{r.name}</h3>
              <a
                href={r.url}
                target="_blank"
                className="text-sm text-blue-500 hover:underline"
              >
                Open ↗
              </a>
            </div>

            {r.error ? (
              <p className="text-red-500 text-sm">❌ {r.error}</p>
            ) : r.response ? (
              <pre className="bg-white text-xs p-3 rounded border overflow-x-auto">
                {JSON.stringify(r.response, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-400 text-sm italic">Pending...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
