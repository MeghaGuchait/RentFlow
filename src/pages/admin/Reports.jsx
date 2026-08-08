import React from "react";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { formatCurrency } from "../../utils/lateFee.js";

export default function Reports() {
  const { products, orders } = useStore();

  const byCategory = products.map((p) => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    revenue: orders.filter((o) => o.productId === p.id).reduce((s, o) => s + o.total, 0),
  }));

  return (
    <AdminLayout title="Reports">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-text/50">Reporting for Admin and individual vendors is scoped separately.</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline"><Printer size={14} /> Print</Button>
          <Button size="sm" variant="outline"><FileSpreadsheet size={14} /> Excel/CSV</Button>
          <Button size="sm" variant="outline"><FileText size={14} /> PDF</Button>
        </div>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 font-semibold text-brand-text">Revenue by Product</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={byCategory}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#1e1e1e99" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#1e1e1e99" }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v) => formatCurrency(v)}
              contentStyle={{ borderRadius: 10, border: "1px solid #1e1e1e15", fontSize: 12 }}
            />
            <Bar dataKey="revenue" fill="#9d5977" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </AdminLayout>
  );
}
