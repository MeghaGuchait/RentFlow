import React from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";

export default function AdminLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-brand-text/[0.015]">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
