import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import tnclogo from "/attached_assets/tnclogo.png";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname.startsWith("/admin/orders") ||
    location.pathname.startsWith("/order-status");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header (no en admin ni order-status) */}
      {!hideHeaderFooter && (
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={tnclogo} alt="The Neighborhood Coffee Logo" className="h-12" />
            </Link>
            <div className="text-sm italic text-[#E5A645]">
              More than Coffee, it's a neighborhood tradition, from our home to yours.
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {/* Footer (no en admin ni order-status) */}
      {!hideHeaderFooter && (
        <footer className="bg-gray-50 border-t mt-6">
          <div className="max-w-6xl mx-auto p-4 flex flex-col items-center text-sm text-gray-600">
            <div className="flex items-center gap-1 text-gray-500">
              <span>❤️</span>
              <span>Crafted in El Paso with love</span>
            </div>
            <div className="mt-1">&copy; 2025 The Neighborhood Coffee</div>
          </div>
        </footer>
      )}
    </div>
  );
}
