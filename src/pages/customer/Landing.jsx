import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Clock, LayoutDashboard, Repeat } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import RentFlowLogo from "../../components/Logo.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { PRODUCTS } from "../../data/mockData.js";

const FEATURES = [
  { icon: LayoutDashboard, title: "Live Operations Dashboard", desc: "Track active rentals, pickups, returns, and revenue in one screen." },
  { icon: ShieldCheck, title: "Automated Deposits", desc: "Deposits are held, reconciled, and refunded without spreadsheets." },
  { icon: Clock, title: "Smart Late Fees", desc: "Grace periods and per-hour penalties calculate themselves on return." },
  { icon: Repeat, title: "Full Lifecycle", desc: "From quotation to pickup to return — one system, zero manual steps." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <RentFlowLogo showTagline className="mx-auto h-24 w-auto" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-brand-text sm:text-5xl"
          >
            Run your rental business
            <br />
            <span className="text-brand-accent">from a single screen.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-brand-text/60"
          >
            RentFlow automates pickup and return scheduling, security deposits, and late
            fees — so your team spends less time reconciling and more time growing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button as={Link} to="/shop" size="lg">
              Browse Products <ArrowRight size={16} />
            </Button>
            <Button as={Link} to="/admin" variant="outline" size="lg">
              View Admin Dashboard
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Card key={f.title} hover className="p-6" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="mb-4 inline-flex rounded-xl bg-brand-accentSoft p-2.5 text-brand-accent">
                <f.icon size={19} />
              </div>
              <h3 className="font-semibold text-brand-text">{f.title}</h3>
              <p className="mt-1.5 text-sm text-brand-text/55">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-brand-accentSoft/40 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="strip-underline text-xs font-semibold uppercase tracking-widest text-brand-accent">
                Popular right now
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-brand-text">Trending rentals</h2>
            </div>
            <Link to="/shop" className="text-sm font-medium text-brand-accent hover:underline">
              See all products →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.slice(0, 3).map((p) => (
              <Link key={p.id} to={`/product/${p.id}`}>
                <Card hover className="overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs text-brand-text/45">{p.category}</p>
                    <h3 className="mt-1 font-medium text-brand-text">{p.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-brand-accent">${p.pricePerDay} / day</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-brand-text/8 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <RentFlowLogo className="h-6 w-auto" />
          <p className="text-xs text-brand-text/40">© 2026 RentFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
