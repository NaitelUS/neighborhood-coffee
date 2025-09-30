import { useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const Toast = () => {
    if (!toast) return null;

    const bgColor =
      toast.type === "error"
        ? "bg-red-600"
        : toast.type === "info"
        ? "bg-blue-600"
        : "bg-green-600";

    return (
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg animate-fade-in-out z-50 ${bgColor}`}
      >
        {toast.message}
      </div>
    );
  };

  return { showToast, Toast };
}
