import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  LayoutGrid,
  ClipboardList,
  Package,
  BarChart3,
  Settings,
  CalendarDays,
  Tags,
  ListChecks,
  FileSignature,
} from "lucide-react";
import RentFlowLogo from "./Logo.jsx";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

const CONFIG_NAV = [
  { to: "/admin/pricelists", label: "Price Lists", icon: Tags },
  { to: "/admin/attributes", label: "Attributes", icon: ListChecks },
  { to: "/admin/quotation-templates", label: "Quotation Templates", icon: FileSignature },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-brand-text/8 bg-white px-4 py-5 md:flex">
      <div className="px-2 pb-6">
        <RentFlowLogo className="h-8 w-auto" />
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-accentSoft text-brand-accentDark"
                  : "text-brand-text/60 hover:bg-brand-text/5 hover:text-brand-text"
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <p className="mb-1 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-brand-text/35">
        Configuration
      </p>
      <nav className="flex flex-col gap-1">
        {CONFIG_NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-accentSoft text-brand-accentDark"
                  : "text-brand-text/60 hover:bg-brand-text/5 hover:text-brand-text"
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
