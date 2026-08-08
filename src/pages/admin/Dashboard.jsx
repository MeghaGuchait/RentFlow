import React from "react";
import { Link } from "react-router-dom";
import { PackageCheck, CalendarClock, Truck, RotateCcw, AlertTriangle, DollarSign, ShieldCheck, Percent } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AdminLayout from "../../components/AdminLayout.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { formatCurrency } from "../../utils/lateFee.js";

const trend = [
  { day: "Mon", sales: 320 }, { day: "Tue", sales: 480 }, { day: "Wed", sales: 260 },
  { day: "Thu", sales: 610 }, { day: "Fri", sales: 540 }, { day: "Sat", sales: 720 }, { day: "Sun", sales: 390 },
];

export default function Dashboard() {
  const { dashboardStats, orders, products } = useStore();

  return (
    <AdminLayout title="Rental Operations Dashboard">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={PackageCheck} label="Active Rentals" value={dashboardStats.activeRentals} />
        <StatCard icon={CalendarClock} label="Due Today" value={dashboardStats.dueToday} />
        <StatCard icon={Truck} label="Upcoming Pickups" value={dashboardStats.upcomingPickups} />
        <StatCard icon={RotateCcw} label="Upcoming Returns" value={dashboardStats.upcomingReturns} />
        <StatCard icon={AlertTriangle} label="Overdue Rentals" value={dashboardStats.overdue} accent />
        <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(dashboardStats.revenue)} />
        <StatCard icon={ShieldCheck} label="Deposits Held" value={formatCurrency(dashboardStats.depositsHeld)} />
        <StatCard icon={Percent} label="Late Fee Collection" value={formatCurrency(dashboardStats.lateFeeCollected)} accent />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-semibold text-brand-text">Last 7 Days — Sales</h3>
            <span className="text-xs text-brand-text/40">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="accentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9d5977" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#9d5977" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#1e1e1e99" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #1e1e1e15", fontSize: 12 }} />
              <Area type="monotone" dataKey="sales" stroke="#9d5977" strokeWidth={2} fill="url(#accentFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold text-brand-text">Priority Actions</h3>
          <div className="space-y-3">
            {orders
              .filter((o) => ["late_pickup", "late_return", "quotation"].includes(o.status))
              .slice(0, 5)
              .map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-lg border border-brand-text/8 p-3">
                  <div>
                    <p className="text-sm font-medium text-brand-text">{o.id} · {o.customer}</p>
                    <p className="text-xs text-brand-text/40">{products.find((p) => p.id === o.productId)?.name}</p>
                  </div>
                  <Badge status={o.status} />
                </div>
              ))}
          </div>
          <Link to="/admin/orders" className="mt-4 block text-center text-sm font-medium text-brand-accent hover:underline">
            View all orders →
          </Link>
        </Card>
      </div>
    </AdminLayout>
  );
}
