import React from "react";
import clsx from "clsx";

const STATUS_STYLES = {
  reserved: "bg-blue-50 text-blue-600",
  quotation: "bg-amber-50 text-amber-600",
  quotation_sent: "bg-amber-50 text-amber-600",
  picked_up: "bg-emerald-50 text-emerald-600",
  late_pickup: "bg-red-50 text-red-600",
  late_return: "bg-red-50 text-red-600",
  returned: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-brand-text/5 text-brand-text/50",
  confirmed: "bg-emerald-50 text-emerald-600",
  invoiced: "bg-brand-accentSoft text-brand-accentDark",
  nothing_to_invoice: "bg-brand-text/5 text-brand-text/50",
  draft: "bg-brand-text/5 text-brand-text/60",
  posted: "bg-emerald-50 text-emerald-600",
};

export default function Badge({ status, children, className }) {
  const label = children || status?.replaceAll("_", " ");
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        STATUS_STYLES[status] || "bg-brand-text/5 text-brand-text/70",
        className
      )}
    >
      {label}
    </span>
  );
}
