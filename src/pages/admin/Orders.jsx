import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, LayoutList, Columns3 } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Input from "../../components/ui/Input.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { formatCurrency, formatDate } from "../../utils/lateFee.js";
const KANBAN_COLUMNS = [
  { key: "quotation", label: "Quotation" },
  { key: "quotation_sent", label: "Quotation Sent" },
  { key: "reserved", label: "Reserved / SO" },
  { key: "picked_up", label: "Picked Up" },
  { key: "late_pickup", label: "Late Pickup / Return" },
  { key: "returned", label: "Returned" },
  { key: "cancelled", label: "Cancelled" },
];
export default function Orders() {
  const { orders, products, createOrder } = useStore();
  const [showNewModal, setShowNewModal] = useState(false);
  const [view, setView] = useState("list");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newOrder, setNewOrder] = useState({
    customer: "",
    productId: products?.[0]?.id || "",
    qty: 1,
    pickupDate: new Date().toISOString().slice(0, 16),
    returnDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    status: "quotation",
  });
  const handleCreateOrder = (e) => {
    e.preventDefault();
    const selProd = products.find((p) => p.id === newOrder.productId);
    const total = (selProd?.pricePerDay || 20) * Number(newOrder.qty);
    const depositHeld = (selProd?.securityDeposit || 50) * Number(newOrder.qty);
    createOrder({
      ...newOrder,
      total,
      depositHeld,
    });
    setShowNewModal(false);
    setNewOrder({
      customer: "",
      productId: products[0]?.id || "",
      qty: 1,
      pickupDate: new Date().toISOString().slice(0, 16),
      returnDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
      status: "quotation",
    });
  };
  const filteredOrders = orders.filter((o) => {
    if (filterStatus === "all") return true;
    return o.status === filterStatus;
  });
  return (
     <AdminLayout title="Rental Orders &amp; Quotations">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-brand-text/12 p-1 bg-white">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${view === "list" ? "bg-brand-accentSoft text-brand-accentDark" : "text-brand-text/50"}`}
            >
              <LayoutList size={14} /> List View
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${view === "kanban" ? "bg-brand-accentSoft text-brand-accentDark" : "text-brand-text/50"}`}
            >
              <Columns3 size={14} /> Kanban Pipeline
            </button>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-brand-text/12 bg-white px-3 py-1.5 text-xs text-brand-text/70 font-medium focus:outline-none focus:border-brand-accent"
          >
            <option value="all">All Statuses</option>
            {KANBAN_COLUMNS.map((col) => (
              <option key={col.key} value={col.key}>
                {col.label}
              </option>
            ))}
          </select>
        </div>
                <Button size="sm" onClick={() => setShowNewModal(true)}>
          <Plus size={14} /> Create Quotation / Sale Order
        </Button>
      </div>
      {view === "list" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-brand-text/8 bg-brand-text/[0.02] uppercase tracking-wide text-brand-text/45 font-semibold">
                  <th className="px-4 py-3">Order Ref</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Pickup Date</th>
                  <th className="px-4 py-3">Return Due</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Invoice Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-text/5">
                {filteredOrders.map((o) => {
                  const prod = products.find((p) => p.id === o.productId);
                  return (
                    <tr key={o.id} className="hover:bg-brand-accentSoft/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/admin/orders/${o.id}`} className="font-semibold text-brand-accent hover:underline font-mono">
                          {o.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-text">{o.customer}</td>
                      <td className="px-4 py-3 text-brand-text/70">{prod?.name || "Product"}</td>
                      <td className="px-4 py-3"><Badge status={o.status} /></td>
                      <td className="px-4 py-3 text-brand-text/60 font-mono">{formatDate(o.pickupDate)}</td>
                      <td className="px-4 py-3 text-brand-text/60 font-mono">{formatDate(o.returnDate)}</td>
                      <td className="px-4 py-3 text-right font-bold text-brand-text">{formatCurrency(o.total)}</td>
                      <td className="px-4 py-3"><Badge status={o.invoiceStatus} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.key);
            return (
              <div key={col.key} className="rounded-2xl bg-brand-text/[0.02] p-3 border border-brand-text/5 min-w-[200px]">
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-text/60">
                    {col.label}
                  </p>
                  <span className="rounded-full bg-brand-text/10 px-2 py-0.5 text-[10px] font-bold text-brand-text/60">
                    {colOrders.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colOrders.map((o) => {
                    const prod = products.find((p) => p.id === o.productId);
                    return (
                      <Link key={o.id} to={`/admin/orders/${o.id}`}>
                        <Card hover className="p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-mono font-bold text-brand-accent">{o.id}</p>
                            <Badge status={o.invoiceStatus || "draft"} />
                          </div>
                          <p className="text-xs font-semibold text-brand-text truncate">{o.customer}</p>
                          <p className="text-[11px] text-brand-text/50 truncate">{prod?.name}</p>
                                                  <div className="flex items-center justify-between pt-1 border-t border-brand-text/5 text-xs">
                            <span className="text-[10px] text-brand-text/40">Dep: ${o.depositHeld || 0}</span>
                            <span className="font-bold text-brand-accent">{formatCurrency(o.total)}</span>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
                      );
          })}
        </div>
      )}
      {/* New Order Creation Modal */}
      <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="Create New Rental Order / Quotation">
        <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
          <Input
            label="Customer Name"
            required
            placeholder="e.g. Wood Corner or Smith"
            value={newOrder.customer}
            onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
          />
          <div>
            <label className="block font-semibold text-brand-text mb-1">Select Rental Product</label>
            <select
              className="w-full rounded-lg border border-brand-text/15 px-3 py-2 text-xs focus:border-brand-accent focus:outline-none"
              value={newOrder.productId}
              onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${p.pricePerDay}/day (Deposit: ${p.securityDeposit})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Quantity"
              type="number"
              min={1}
              required
              value={newOrder.qty}
              onChange={(e) => setNewOrder({ ...newOrder, qty: e.target.value })}
            />
            <div>
              <label className="block font-semibold text-brand-text mb-1">Initial Order Status</label>
              <select
                className="w-full rounded-lg border border-brand-text/15 px-3 py-2 text-xs focus:border-brand-accent focus:outline-none"
                value={newOrder.status}
                onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
              >
                <option value="quotation">Draft Quotation</option>
                <option value="reserved">Sale Order / Confirmed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brand-text mb-1">Pickup Date &amp; Time</label>
              <input
                type="datetime-local"
                className="w-full rounded-lg border border-brand-text/15 px-3 py-2 text-xs"
                value={newOrder.pickupDate}
                          onChange={(e) => setNewOrder({ ...newOrder, pickupDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block font-semibold text-brand-text mb-1">Scheduled Return Date</label>
              <input
                type="datetime-local"
                className="w-full rounded-lg border border-brand-text/15 px-3 py-2 text-xs"
                value={newOrder.returnDate}
                onChange={(e) => setNewOrder({ ...newOrder, returnDate: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-3">
            Create &amp; Save Rental Order
          </Button>
        </form>
      </Modal>
    </AdminLayout>
  );
}

