import React, { useState } from "react";
import { FileSpreadsheet, FileText, Printer, Filter, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatCurrency } from "../../utils/lateFee.js";
export default function Reports() {
  const { products, orders } = useStore();
  const { user } = useAuth();
  const [scope, setScope] = useState(user?.role === "vendor" ? "vendor" : "admin");
  const [criteria, setCriteria] = useState("product"); // 'product' or 'month'
  const [exportMsg, setExportMsg] = useState("");
    const handleExport = (type) => {
    setExportMsg(`Exporting rental analytics report as ${type}... File saved to downloads.`);
    setTimeout(() => setExportMsg(""), 3500);
  };
  const chartData = products.map((p) => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    revenue: orders.filter((o) => o.productId === p.id).reduce((s, o) => s + (o.total || 0), 0),
    deposits: orders.filter((o) => o.productId === p.id).reduce((s, o) => s + (o.depositHeld || 0), 0),
  }));

  return (
    <AdminLayout title="Analytics &amp; Rental Reports">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
       <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-brand-text/12 bg-white p-1 text-xs font-semibold">
            <button
              onClick={() => setScope("admin")}
              className={`px-3 py-1.5 rounded-md transition-all ${scope === "admin" ? "bg-brand-accentSoft text-brand-accentDark font-bold" : "text-brand-text/50"}`}
            >
              Organization-wide (Admin)
            </button>
            <button
              onClick={() => setScope("vendor")}
              className={`px-3 py-1.5 rounded-md transition-all ${scope === "vendor" ? "bg-purple-50 text-purple-700 font-bold" : "text-brand-text/50"}`}
            >
              My Vendor Store ({user?.companyName || "Vendor"})
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-text/60 bg-white border border-brand-text/12 px-3 py-1.5 rounded-lg">
            <Filter size={13} />
            <select
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              className="bg-transparent font-medium focus:outline-none"
            >
              <option value="product">Analysis Criteria: By Product Revenue</option>
              <option value="deposit">Analysis Criteria: By Security Deposits Held</option>
            </select>
          </div>
        </div>
<div className="flex gap-2">
<Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer size={14} /> Print
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleExport("Excel (.xlsx / .csv)")}>
            <FileSpreadsheet size={14} /> Excel / CSV
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleExport("PDF Report (.pdf)")}>
            <FileText size={14} /> Export PDF
          </Button>
        </div>
      </div>
  {exportMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <CheckCircle2 size={16} /> {exportMsg}
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-3 mb-5">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-brand-text/50 uppercase font-semibold">Total Revenue Analyzed</p>
          <p className="text-xl font-bold text-brand-accent">{formatCurrency(orders.reduce((s, o) => s + (o.total || 0), 0))}</p>
          <p className="text-[11px] text-emerald-600 font-medium">↑ +14% vs previous period</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-brand-text/50 uppercase font-semibold">Active Escrow Deposits</p>
          <p className="text-xl font-bold text-amber-700">{formatCurrency(orders.reduce((s, o) => s + (o.depositHeld || 0), 0))}</p>
          <p className="text-[11px] text-brand-text/45">Held across ongoing rentals</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-brand-text/50 uppercase font-semibold">Late Fees Recovered</p>
          <p className="text-xl font-bold text-emerald-700">{formatCurrency(orders.reduce((s, o) => s + (o.settlement?.lateFee || 0), 0))}</p>
          <p className="text-[11px] text-emerald-600 font-medium">Auto-deducted on late returns</p>
        </Card>
      </div>
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-brand-text text-sm">
          {criteria === "product" ? "Product Revenue Breakdown ($)" : "Security Deposit Holdings by Product ($)"}
          </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#1e1e1e99" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#1e1e1e99" }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v) => formatCurrency(v)}
              contentStyle={{ borderRadius: 10, border: "1px solid #1e1e1e15", fontSize: 12 }}
            />    <Bar dataKey={criteria === "product" ? "revenue" : "deposits"} fill="#9d5977" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </AdminLayout>
  );
}

