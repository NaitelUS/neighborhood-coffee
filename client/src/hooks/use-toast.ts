import { useState, useCallback } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500); // 2.5s visible
  }, []);

  const Toast = () =>
    message ? (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg animate-fade-in-out z-50">
        {message}
      </div>
    ) : null;

  return { showToast, Toast };
}
