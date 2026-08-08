import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { useStore } from "../../context/StoreContext.jsx";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function Schedule() {
  const { orders, products } = useStore();
  const [cursor, setCursor] = useState(new Date(2026, 0, 1)); // Jan 2026, matches the wireframe
  const [selectedDay, setSelectedDay] = useState(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const ordersOnDay = (day) => {
    if (!day) return [];
    const target = new Date(year, month, day).toDateString();
    return orders.filter(
      (o) => new Date(o.pickupDate).toDateString() === target || new Date(o.returnDate).toDateString() === target
    );
  };

  const dayStatus = (day) => {
    const list = ordersOnDay(day);
    if (list.some((o) => o.status === "late_pickup" || o.status === "late_return")) return "late";
    if (list.some((o) => o.status === "picked_up")) return "booked";
    if (list.length) return "pickup";
    return null;
  };

  const STATUS_DOT = {
    pickup: "bg-blue-400",
    late: "bg-red-400",
    booked: "bg-brand-accent",
  };

  return (
    <AdminLayout title="Rental Scheduler">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded-full p-1.5 hover:bg-brand-accentSoft">
              <ChevronLeft size={16} />
            </button>
            <h3 className="font-semibold text-brand-text">
              {cursor.toLocaleString("default", { month: "long" })} {year}
            </h3>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded-full p-1.5 hover:bg-brand-accentSoft">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-brand-text/40">
            {WEEKDAYS.map((d, i) => <div key={i} className="py-1.5">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              const status = dayStatus(day);
              return (
                <button
                  key={i}
                  disabled={!day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex h-16 flex-col items-start rounded-lg border p-1.5 text-left text-xs transition-colors ${
                    !day
                      ? "border-transparent"
                      : selectedDay === day
                      ? "border-brand-accent bg-brand-accentSoft"
                      : "border-brand-text/8 hover:border-brand-accent"
                  }`}
                >
                  <span className="text-brand-text/70">{day}</span>
                  {status && <span className={`mt-auto h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex gap-4 text-xs text-brand-text/50">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-400" /> Pickup</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-accent" /> Booked</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /> Late</span>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 font-semibold text-brand-text">
            {selectedDay ? `${cursor.toLocaleString("default", { month: "short" })} ${selectedDay}, ${year}` : "Select a date"}
          </h3>
          {selectedDay && ordersOnDay(selectedDay).length === 0 && (
            <p className="text-sm text-brand-text/40">Nothing scheduled.</p>
          )}
          <div className="space-y-2">
            {ordersOnDay(selectedDay).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border border-brand-text/8 p-3">
                <div>
                  <p className="text-sm font-medium text-brand-text">{o.id} · {o.customer}</p>
                  <p className="text-xs text-brand-text/40">{products.find((p) => p.id === o.productId)?.name}, {o.qty} unit(s)</p>
                </div>
                <Badge status={o.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
