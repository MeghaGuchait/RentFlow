import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminTopbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between border-b border-brand-text/8 bg-white px-6 py-4">
      <h1 className="text-xl font-semibold text-brand-text">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/35" />
          <input
            placeholder="Search…"
            className="w-56 rounded-lg border border-brand-text/12 bg-brand-text/[0.02] py-2 pl-9 pr-3 text-sm focus:border-brand-accent"
          />
        </div>
        <button className="rounded-full p-2 text-brand-text/50 hover:bg-brand-accentSoft hover:text-brand-accent">
          <Bell size={17} />
        </button>
        <Link to="/admin/settings" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-xs font-semibold text-white">
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
  );
}
