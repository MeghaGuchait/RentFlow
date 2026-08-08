import React from "react";
import Navbar from "../../components/Navbar.jsx";

export function StaticPage({ title, children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-2xl font-semibold text-brand-text">{title}</h1>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-brand-text/60">{children}</div>
      </div>
    </div>
  );
}

export const Terms = () => (
  <StaticPage title="Terms & Conditions">
    <p>By renting through RentFlow, you agree to return items by the scheduled return date and time. Late returns incur a per-hour fee, deducted from your security deposit.</p>
    <p>Security deposits are refunded in full for on-time returns and are otherwise settled automatically according to the late fee schedule shown on each product page.</p>
  </StaticPage>
);

export const About = () => (
  <StaticPage title="About Us">
    <p>RentFlow helps rental businesses run pickup, return, deposit, and billing workflows from a single dashboard — reducing manual reconciliation and giving managers real-time visibility.</p>
  </StaticPage>
);

export const Contact = () => (
  <StaticPage title="Contact Us">
    <p>Email us at support@rentflow.io or call +1 (555) 010-2030. Our team typically responds within one business day.</p>
  </StaticPage>
);
