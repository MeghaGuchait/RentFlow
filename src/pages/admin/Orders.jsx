import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutList, Columns3, Plus } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { formatCurrency, formatDate } from "../../utils/lateFee.js";

const KANBAN_COLUMNS = [
  { key: "quotation", label: "Quotation" },
  { key: "reserved", label: "Reserved" },
  { key: "picked_up", label: "Picked Up" },
  { key: "late_pickup", label: "Late Pickup" },
  { key: "cancelled", label: "Cancelled" },
];

export default function Orders() {
  const { orders, products } = useStore();
  const [view, setView] = useState("list");

  return (
    <AdminLayout title="Orders">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex rounded-lg border border-brand-text/12 p-1">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${view === "list" ? "bg-brand-accentSoft text-brand-accentDark" : "text-brand-text/50"}`}
          >
            <LayoutList size={14} /> List
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${view === "kanban" ? "bg-brand-accentSoft text-brand-accentDark" : "text-brand-text/50"}`}
          >
            <Columns3 size={14} /> Kanban
          </button>
        </div>
        <Button size="sm">
          <Plus size={14} /> New Rental Order
        </Button>
      </div>

      {view === "list" ? (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-text/8 bg-brand-text/[0.02] text-left text-xs uppercase tracking-wide text-brand-text/45">
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Pickup Date</th>
                <th className="px-4 py-3">Return Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Invoice Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-brand-text/5 last:border-0 hover:bg-brand-accentSoft/30">
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${o.id}`} className="font-medium text-brand-accent hover:underline">
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3"><Badge status={o.status} /></td>
                  <td className="px-4 py-3 text-brand-text/60">{formatDate(o.pickupDate)}</td>
                  <td className="px-4 py-3 text-brand-text/60">{formatDate(o.returnDate)}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3"><Badge status={o.invoiceStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {KANBAN_COLUMNS.map((col) => (
            <div key={col.key} className="rounded-2xl bg-brand-text/[0.02] p-3">
              <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-brand-text/45">
                {col.label} · {orders.filter((o) => o.status === col.key).length}
              </p>
              <div className="space-y-2">
                {orders
                  .filter((o) => o.status === col.key)
                  .map((o) => (
                    <Link key={o.id} to={`/admin/orders/${o.id}`}>
                      <Card hover className="p-3">
                        <p className="text-sm font-medium text-brand-text">{o.id}</p>
                        <p className="text-xs text-brand-text/50">{o.customer}</p>
                        <p className="mt-1 text-xs text-brand-text/40">{products.find((p) => p.id === o.productId)?.name}</p>
                        <p className="mt-2 text-sm font-semibold text-brand-accent">{formatCurrency(o.total)}</p>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
