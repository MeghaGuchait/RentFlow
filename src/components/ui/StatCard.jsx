import React from "react";
import Card from "./Card.jsx";

export default function StatCard({ icon: Icon, label, value, sublabel, accent = false }) {
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-text/45">{label}</p>
          <p className={`mt-2 text-2xl font-semibold ${accent ? "text-brand-accent" : "text-brand-text"}`}>
            {value}
          </p>
          {sublabel && <p className="mt-1 text-xs text-brand-text/40">{sublabel}</p>}
        </div>
        {Icon && (
          <div className="rounded-xl bg-brand-accentSoft p-2.5 text-brand-accent">
            <Icon size={18} />
          </div>
        )}
      </div>
    </Card>
  );
}
