import React, { useState } from "react";
import { Sparkles, Wrench, Navigation, BellRing, Check, ArrowRight } from "lucide-react";
import Modal from "./ui/Modal.jsx";
import Button from "./ui/Button.jsx";
import Badge from "./ui/Badge.jsx";
import { useStore } from "../context/StoreContext.jsx";
export default function BonusFeaturesModal({ open, onClose }) {
  const { products, orders } = useStore();
  const [activeTab, setActiveTab] = useState("maintenance");
  const [remindersSent, setRemindersSent] = useState({});
  const handleSendReminder = (orderId) => {
    setRemindersSent((prev) => ({ ...prev, [orderId]: true }));
  };
  return (
    <Modal open={open} onClose={onClose} title="AI & Automation Bonus Suite">
      <div className="space-y-4">
        <div className="flex rounded-xl bg-brand-text/5 p-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab("maintenance")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === "maintenance" ? "bg-white shadow-sm text-brand-accent font-semibold" : "text-brand-text/60"
            }`}
          >
            <Wrench className="h-4 w-4" /> Predictive Maintenance
          </button>
          <button
            onClick={() => setActiveTab("route")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === "route" ? "bg-white shadow-sm text-brand-accent font-semibold" : "text-brand-text/60"
            }`}
          >
            <Navigation className="h-4 w-4" /> Route Optimization
          </button>
          <button
            onClick={() => setActiveTab("reminders")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === "reminders" ? "bg-white shadow-sm text-brand-accent font-semibold" : "text-brand-text/60"
            }`}
          >
            <BellRing className="h-4 w-4" /> Auto Reminders
          </button>
        </div>
        {activeTab === "maintenance" && (
          <div className="space-y-3">
            <p className="text-xs text-brand-text/60">
              AI monitors rental cycles, wear metrics, and return inspection reports to flag items due for service.          </p>
            {products.slice(0, 3).map((p, idx) => {
              const wearLevel = [85, 42, 91][idx % 3];
              const isUrgent = wearLevel > 80;
              return (
                <div key={p.id} className="rounded-xl border border-brand-text/10 p-3.5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-brand-text">{p.name}</p>
                    <p className="text-xs text-brand-text/50">
                      Category: {p.category} · Stock: {p.inStock} units
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-28 rounded-full bg-brand-text/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isUrgent ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${wearLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono font-medium">{wearLevel}% Wear</span>
                    </div>
                  </div>
                  <Button size="sm" variant={isUrgent ? "default" : "outline"}>
                    {isUrgent ? "Schedule Maintenance" : "Inspect Unit"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
     {activeTab === "route" && (
          <div className="space-y-3">
            <p className="text-xs text-brand-text/60">
              Smart route planner automatically clusters today&apos;s pickups and returns by location for minimum drive time.
            </p>
            <div className="rounded-xl bg-gradient-to-br from-brand-accentSoft to-purple-50 p-4 border border-brand-accent/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-text">
                  <Navigation className="h-4 w-4 text-brand-accent" /> Optimized Pickup Sequence (3 Stops)
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-accent text-white">Est. 42 mins total</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-brand-text/5">
                  <span className="h-5 w-5 rounded-full bg-brand-accent text-white font-bold flex items-center justify-center text-[10px]">1</span>
                  <div className="flex-1">
                    <p className="font-semibold text-brand-text">Stop 1: Wood Corner (SO0001)</p>
                    <p className="text-brand-text/50">221B Baker Street · Pickup at 10:00 AM</p>
                  </div>
                </div>
                <div className="flex justify-center text-brand-text/30"><ArrowRight className="h-3.5 w-3.5 rotate-90" /></div>
                <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-brand-text/5">
                  <span className="h-5 w-5 rounded-full bg-brand-accent text-white font-bold flex items-center justify-center text-[10px]">2</span>
                  <div className="flex-1">
                    <p className="font-semibold text-brand-text">Stop 2: John Electronics (SO0010)</p>
                    <p className="text-brand-text/50">44 Tech Park Avenue · Pickup at 11:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
     {activeTab === "reminders" && (
          <div className="space-y-3">
            <p className="text-xs text-brand-text/60">
              Automated SMS & Email triggers notify portal users 2 hours before scheduled returns to prevent late fees.
            </p>
            {orders.slice(0, 3).map((o) => (
              <div key={o.id} className="rounded-xl border border-brand-text/10 p-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-brand-text">{o.id} — {o.customer}</p>
                  <p className="text-xs text-brand-text/50">Due date: {new Date(o.returnDate).toLocaleDateString()}</p>
                </div>
                <Button
                  size="sm"
                  variant={remindersSent[o.id] ? "subtle" : "outline"}
                  onClick={() => handleSendReminder(o.id)}
                  disabled={remindersSent[o.id]}
                >
                  {remindersSent[o.id] ? (
                    <span className="flex items-center gap-1 text-emerald-600"><Check className="h-3.5 w-3.5" /> Sent</span>
                  ) : (
                    "Send Reminder Now"
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}