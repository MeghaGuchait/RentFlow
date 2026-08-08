import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, QrCode, Sparkles, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import QRScannerModal from "./QRScannerModal.jsx";
import BonusFeaturesModal from "./BonusFeaturesModal.jsx";
export default function AdminTopbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const isVendor = user?.role === "vendor";
  return (
        <>
      <div className="flex items-center justify-between border-b border-brand-text/8 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-brand-text">{title}</h1>
          {isVendor ? (
            <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 border border-purple-200">
              <Store size={12} /> Vendor Portal ({user?.companyName || "Vendor"})
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
              Admin HQ
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 rounded-xl border border-brand-accent/20 bg-brand-accentSoft px-3 py-1.5 text-xs font-semibold text-brand-accentDark hover:bg-brand-accent/15 transition-all"
            title="Scan QR or Barcode"
          >
            <QrCode size={15} /> <span className="hidden sm:inline">QR Scan</span>
          </button>
          <button
            onClick={() => setShowBonus(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all"
            title="AI Maintenance & Smart Route Planner"
          >
            <Sparkles size={15} /> <span className="hidden sm:inline">AI Suite</span>
          </button>
          <div className="relative hidden md:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/35" />
            <input
              placeholder="Search orders, products..."
              className="w-48 rounded-lg border border-brand-text/12 bg-brand-text/[0.02] py-1.5 pl-9 pr-3 text-xs focus:border-brand-accent focus:outline-none"
            />
          </div>
           <button className="rounded-full p-2 text-brand-text/50 hover:bg-brand-accentSoft hover:text-brand-accent">
            <Bell size={17} />
          </button>
          <Link to="/admin/settings" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-xs font-semibold text-white shadow-sm">
              {user?.name?.[0] || "A"}
            </span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="rounded-full p-2 text-brand-text/50 hover:bg-brand-accentSoft hover:text-brand-accent"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
        <QRScannerModal open={showQR} onClose={() => setShowQR(false)} />
      <BonusFeaturesModal open={showBonus} onClose={() => setShowBonus(false)} />
    </>
  );
}
