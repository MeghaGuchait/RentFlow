import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Card from "../../components/ui/Card.jsx";
import { useStore } from "../../context/StoreContext.jsx";

export default function Shop() {
  const { products, categories } = useStore();
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100);
  const [duration, setDuration] = useState("All Duration");

  const filtered = useMemo(() => {
    return products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.pricePerDay <= maxPrice
    );
  }, [products, category, maxPrice]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-semibold text-brand-text">All Products</h1>
        <p className="mt-1 text-sm text-brand-text/50">{filtered.length} items available to rent</p>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-brand-text">Category</h3>
              <div className="space-y-1.5">
                {["All", ...categories].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                      category === c ? "bg-brand-accentSoft text-brand-accentDark font-medium" : "text-brand-text/60 hover:bg-brand-text/5"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-brand-text">Price Range (per day)</h3>
              <input
                type="range"
                min={5}
                max={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-accent"
              />
              <div className="mt-1 flex justify-between text-xs text-brand-text/40">
                <span>$1</span>
                <span>${maxPrice}</span>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-brand-text">Duration</h3>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-brand-text/15 px-3 py-2 text-sm"
              >
                <option>All Duration</option>
                <option>1 Month</option>
                <option>6 Month</option>
                <option>1 Year</option>
              </select>
            </div>
          </aside>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link to={`/product/${p.id}`}>
                  <Card hover className="group overflow-hidden">
                    <div className="relative">
                      <img src={p.image} alt={p.name} className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-brand-text/60 hover:text-brand-accent"
                      >
                        <Heart size={15} />
                      </button>
                      {p.inStock === 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-brand-text/80 px-2 py-1 text-[10px] font-medium text-white">
                          Out of stock
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-brand-text/45">{p.category}</p>
                      <h3 className="mt-1 font-medium text-brand-text">{p.name}</h3>
                      <p className="mt-2 text-sm font-semibold text-brand-accent">
                        ${p.pricePerDay} <span className="font-normal text-brand-text/40">/ day</span>
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
